import { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import './App.css';
import PersonList from './components/PersonList';
import CarList from './components/CarList';
import Auth from './components/Auth';
import invitees from './invitees';

// Mașini disponibile
const vehicles = [
  {
    id: 1,
    name: 'Mașina lu Andrei',
    capacity: 4,
    passengers: []
  },
  {
    id: 2,
    name: 'A lu Toni',
    capacity: 4,
    passengers: []
  },
  {
    id: 3,
    name: 'A lu Paul',
    capacity: 4,
    passengers: []
  }
];

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Montserrat', sans-serif;
`;

const Header = styled.header`
  padding: 0 32px;
  padding-top: 24px;
  font-weight: 600;
  margin-bottom: -8px;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  color: #fff;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-left: auto;
  margin-right: 16px;
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border-radius: 20px;
  border: 1px solid #e0e6f0;
  font-family: 'Montserrat', sans-serif;
  min-width: 250px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #ffbd59;
    box-shadow: 0 0 0 2px rgba(255, 189, 89, 0.2);
  }
`;

const MainContainer = styled.main`
  display: flex;
  flex: 1;
  padding: 2rem;
  gap: 2rem;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

function App() {
  // State for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Load saved state from localStorage or use defaults
  const loadSavedState = () => {
    try {
      // Try to load saved person-to-car assignments
      const savedPersonCarMappings = localStorage.getItem('personCarMappings');

      if (savedPersonCarMappings) {
        // Parse the saved person-to-car mappings
        const personCarMappings = JSON.parse(savedPersonCarMappings);

        // Create a set of assigned person IDs for quick lookup
        const assignedPersonIds = new Set();
        personCarMappings.forEach((mapping) => {
          assignedPersonIds.add(mapping.personId);
        });

        // Start with the default vehicles structure
        const carsWithSavedPassengers = vehicles.map((car) => {
          // Create a deep copy of the car
          const carCopy = { ...car, passengers: [] };

          // Find all passenger mappings for this car
          const carMappings = personCarMappings.filter((mapping) => mapping.carId === car.id);

          if (carMappings.length > 0) {
            // For each mapping, find the person in the invitees array
            const passengers = carMappings
              .map((mapping) => {
                // Find the person in the invitees array by ID
                const person = invitees.find((p) => p.id === mapping.personId);

                // If found in invitees, use that; if not, try to use the saved name (for redundancy)
                if (person) {
                  return person;
                } else if (mapping.personName) {
                  // Create minimal person object with the saved name if the original isn't found
                  console.warn(`Person ID ${mapping.personId} not found in invitees array, using saved name`);
                  return {
                    id: mapping.personId,
                    name: mapping.personName,
                    fromWho: mapping.fromWho || undefined,
                  };
                }
                return null;
              })
              .filter((person) => person !== null); // Filter out any null passengers

            carCopy.passengers = passengers;
          }

          return carCopy;
        });

        // Calculate unassigned people as all invitees not in assignedPersonIds
        const unassignedPeople = invitees.filter((person) => !assignedPersonIds.has(person.id)).sort((a, b) => a.id - b.id);

        return {
          cars: carsWithSavedPassengers,
          unassignedPeople: unassignedPeople,
        };
      }
    } catch (err) {
      console.error('Error loading saved state:', err);
    }

    // Return default state if no saved state or error
    return {
      cars: vehicles,
      unassignedPeople: [...invitees].sort((a, b) => a.id - b.id),
    };
  };

  // Initialize state from localStorage or defaults
  const initialState = loadSavedState();
  const [cars, setCars] = useState(initialState.cars);
  const [unassignedPeople, setUnassignedPeople] = useState(initialState.unassignedPeople);
  const [searchTerm, setSearchTerm] = useState('');
  const [foundPerson, setFoundPerson] = useState(null);

  const handleAssignPerson = useCallback(
    (personId, carId) => {
      // First, check if person is in unassigned list
      const unassignedPerson = unassignedPeople.find((p) => p.id === personId);

      // If the person is from the unassigned list
      if (unassignedPerson) {
        // Add to car
        setCars((prev) => {
          const updatedCars = prev.map((car) => {
            // Check if this is the target car
            if (car.id !== carId) return car;

            // Check if car is already at capacity
            if (car.passengers.length >= car.capacity) {
              return car; // Don't add if car is already full
            }

            // Clone the car
            const updatedCar = { 
              ...car, 
              passengers: [...car.passengers, unassignedPerson]
            };

            return updatedCar;
          });

          // Check if any car was updated (person was added to a car)
          const wasAdded = JSON.stringify(updatedCars) !== JSON.stringify(prev);

          // Only remove from unassigned list if the person was added to a car
          if (wasAdded) {
            setUnassignedPeople((prevPeople) => prevPeople.filter((p) => p.id !== personId));
          }

          return updatedCars;
        });
        return;
      }

      // If we get here, person is not in unassigned list
      // The Car component should handle the unassign-and-reassign flow for car-to-car transfers
      // This is a safety fallback only

      // Find the person in an existing car
      let personInCar = null;
      let sourceCarId = null;

      // Look through all cars to find the person
      const carsClone = [...cars];
      for (const car of carsClone) {
        const foundPerson = car.passengers.find((p) => p.id === personId);
        if (foundPerson) {
          personInCar = foundPerson;
          sourceCarId = car.id;
          break;
        }
      }

      if (personInCar && sourceCarId && sourceCarId !== carId) {
        // The logic for car-to-car moves is now handled in the Car component's drop handler
        // This is a fallback that shouldn't normally be needed
        console.log('Car-to-car move via handleAssignPerson fallback');
      }
    },
    [unassignedPeople, cars],
  );

  const handleUnassignPerson = useCallback((personId, carId) => {
    // Find the car and person
    let foundPerson = null;

    setCars((prev) =>
      prev.map((car) => {
        // Check if this is the car we're looking for
        if (car.id !== carId) return car;

        // Find the person in the car
        const personIndex = car.passengers.findIndex((p) => p.id === personId);
        if (personIndex === -1) return car;

        // Save reference to the person we're removing
        foundPerson = car.passengers[personIndex];

        // Clone the car and update to remove the person
        const updatedCar = {
          ...car,
          passengers: car.passengers.filter((p) => p.id !== personId),
        };

        return updatedCar;
      }),
    );

    // Add the person back to unassigned list if we found them and sort by ID
    if (foundPerson) {
      setUnassignedPeople((prev) => {
        const updatedList = [...prev, foundPerson];
        // Sort by ID (assumes IDs are alphanumeric and should be sorted alphabetically)
        return updatedList.sort((a, b) => a.id - b.id);
      });
    }
  }, []);

  // Setup event listeners for custom events
  useEffect(() => {
    // Event handler for moving from car to unassigned list
    const handleUnassignEvent = (event) => {
      const { personId, roomId } = event.detail;
      handleUnassignPerson(personId, roomId);
    };

    // Event handler for car-to-car transfers
    const handleCarToCarTransfer = (event) => {
      const { personId, fromCarId, toCarId } = event.detail;

      // Find the person in the source car
      let foundPerson = null;

      // Look through all cars to find the person
      for (const car of cars) {
        if (car.id === fromCarId) {
          const person = car.passengers.find((p) => p.id === personId);
          if (person) {
            foundPerson = { ...person };
            break;
          }
        }
      }

      if (foundPerson) {
        // Perform the car-to-car transfer
        setCars((prev) => {
          // Clone the cars
          const updatedCars = JSON.parse(JSON.stringify(prev));

          // Step 1: Remove from source car
          for (let i = 0; i < updatedCars.length; i++) {
            if (updatedCars[i].id === fromCarId) {
              updatedCars[i].passengers = updatedCars[i].passengers.filter((p) => p.id !== personId);
            }
          }

          // Step 2: Add to destination car
          for (let i = 0; i < updatedCars.length; i++) {
            if (updatedCars[i].id === toCarId) {
              // Only add if car is not at capacity
              if (updatedCars[i].passengers.length < updatedCars[i].capacity) {
                updatedCars[i].passengers.push(foundPerson);
              }
            }
          }

          return updatedCars;
        });
      }
    };

    window.addEventListener('unassign-person', handleUnassignEvent);
    window.addEventListener('car-to-car-transfer', handleCarToCarTransfer);

    // Cleanup
    return () => {
      window.removeEventListener('unassign-person', handleUnassignEvent);
      window.removeEventListener('car-to-car-transfer', handleCarToCarTransfer);
    };
  }, [handleUnassignPerson, cars]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      // Create a flat array of person-to-car mappings with minimum needed info
      const personCarMappings = [];

      // Extract all person->car assignments from cars
      cars.forEach((car) => {
        // For each passenger in the car, create a mapping entry
        car.passengers.forEach((passenger) => {
          personCarMappings.push({
            personId: passenger.id,
            personName: passenger.name, // Save name for redundancy
            fromWho: passenger.fromWho, // Save additional info for redundancy
            carId: car.id,
          });
        });
      });

      // Save only the mapping between persons and cars, with basic person info for redundancy
      localStorage.setItem('personCarMappings', JSON.stringify(personCarMappings));
      console.log('Person-car mappings saved to localStorage');
    } catch (err) {
      console.error('Error saving state to localStorage:', err);
    }
  }, [cars, unassignedPeople]);

  // Search for people function
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFoundPerson(null);
      return;
    }

    // Search in all people (both unassigned and in cars)
    const lowerTerm = term.toLowerCase();

    // First search in unassigned people
    const foundInUnassigned = unassignedPeople.find((person) => person.name.toLowerCase().includes(lowerTerm));

    if (foundInUnassigned) {
      setFoundPerson({
        person: foundInUnassigned,
        location: 'unassigned',
      });
      return;
    }

    // Then search in assigned people
    for (const car of cars) {
      const foundInCar = car.passengers.find((person) => person.name.toLowerCase().includes(lowerTerm));

      if (foundInCar) {
        setFoundPerson({
          person: foundInCar,
          location: 'assigned',
          carName: car.name,
          carId: car.id,
        });
        return;
      }
    }

    // If no match found
    setFoundPerson(null);
  };

  // Handle successful authentication
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  // Show main app if authenticated
  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <Header>
          <HeaderContainer>
            <HeaderTitle>Planificarea Mașinilor 🚗</HeaderTitle>
            <SearchContainer>
              <SearchInput type="text" placeholder="Caută persoană..." value={searchTerm} onChange={handleSearch} />
            </SearchContainer>
          </HeaderContainer>
        </Header>
        <MainContainer>
          <PersonList people={unassignedPeople} searchTerm={searchTerm} foundPerson={foundPerson} />
          <CarList
            cars={cars}
            onAssignPerson={handleAssignPerson}
            onUnassignPerson={handleUnassignPerson}
            searchTerm={searchTerm}
            foundPerson={foundPerson}
          />
        </MainContainer>
      </AppContainer>
    </DndProvider>
  );
}

export default App;
