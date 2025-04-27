import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Car from './Car';

const Container = styled.div`
  flex: 2;
  background-color: #fffe;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #e0e6f0;
  overflow: hidden;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #444240;
  border-bottom: 2px solid #e0e6f0;
  padding-bottom: 0.75rem;
  margin-bottom: 1.25rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const CarsContainer = styled.div`
  overflow-y: auto;
  flex: 1;
  padding-right: 0.5rem;
`;

const CarSection = styled.div`
  margin-bottom: 2rem;
`;

const CarHeader = styled.div`
  background: linear-gradient(0, hsl(204deg 84.69% 64%), #66a6ff);
  color: #00254a;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
  }
`;

const CarName = styled.h3`
  margin: 0;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  align-items: center;
`;

const CarIcon = styled.span`
  margin-right: 0.75rem;
  font-size: 1.25rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const OccupancyCounter = styled.div`
  background-color: ${props => props.isFull ? '#4ade80' : '#59bdff'};
  color: ${props => props.isFull ? '#166534' : '#00254a'};
  padding: 0.35rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 700;
  margin-right: 1rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
`;

const ExpandIcon = styled.span`
  font-size: 1rem;
  transition: transform 0.3s;
  transform: ${(props) => (props.expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  color: #00254a;
  opacity: 0.7;
`;

const PassengersContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0 0.5rem;
  margin-top: -4px;
  padding-top: 4px;
  max-height: ${(props) => (props.expanded ? '2000px' : '0')};
  overflow: hidden;
  opacity: ${(props) => (props.expanded ? '1' : '0')};
  transition: max-height 0.4s ease-in-out, opacity 0.2s ease-in-out;
  transition-delay: ${(props) => (props.expanded ? '0s, 0.1s' : '0s, 0s')};
  width: 100%;
`;

function CarList({ cars, onAssignPerson, onUnassignPerson, searchTerm, foundPerson }) {
  // State to track which cars are expanded, with all cars expanded by default
  const [expandedCars, setExpandedCars] = useState(() => {
    // Create an object with all cars expanded by default
    const expanded = {};
    cars.forEach(car => {
      expanded[car.id] = true;
    });
    return expanded;
  });

  const getCarIcon = (carName) => {
    if (carName.includes('Andrei')) return '🚙';
    if (carName.includes('Toni')) return '🚗';
    if (carName.includes('Paul')) return '🚘';
    return '🚐';
  };

  const toggleCarExpansion = (carId) => {
    setExpandedCars((prev) => ({
      ...prev,
      [carId]: !prev[carId],
    }));
  };
  
  // Auto-expand car when a person is found
  useEffect(() => {
    if (foundPerson && foundPerson.location === 'assigned') {
      // Find the car that contains the found person
      const carWithFoundPerson = cars.find(car => 
        car.id === foundPerson.carId
      );
      
      if (carWithFoundPerson) {
        setExpandedCars(prev => ({
          ...prev,
          [carWithFoundPerson.id]: true
        }));
      }
    }
  }, [foundPerson, cars]);

  // Calculate total capacity and occupancy for each car
  const getCarStats = (car) => {
    let totalCapacity = car.capacity;
    let totalOccupancy = car.passengers.length;
    
    return { totalCapacity, totalOccupancy, isFull: totalOccupancy >= totalCapacity };
  };

  return (
    <Container>
      <Title>Mașini Disponibile</Title>
      <CarsContainer>
        {cars.map((car) => {
          const { totalCapacity, totalOccupancy, isFull } = getCarStats(car);
          
          // Filter passengers based on search term
          const hasMatchingPassenger = searchTerm 
            ? car.passengers.some(passenger => 
                passenger.name.toLowerCase().includes(searchTerm.toLowerCase())
              ) || 
              (foundPerson && 
               foundPerson.location === 'assigned' && 
               foundPerson.carId === car.id)
            : true;
          
          // If searching and no matching passengers, skip this car entirely
          if (searchTerm && !hasMatchingPassenger) {
            return null;
          }
          
          return (
            <CarSection key={car.id}>
              <CarHeader onClick={() => toggleCarExpansion(car.id)}>
                <HeaderContent>
                  <CarIcon>{getCarIcon(car.name)}</CarIcon>
                  <CarName>
                    {car.name}
                  </CarName>
                </HeaderContent>
                <OccupancyCounter isFull={isFull}>
                  {totalOccupancy}/{totalCapacity}
                </OccupancyCounter>
                <ExpandIcon expanded={expandedCars[car.id]}>▼</ExpandIcon>
              </CarHeader>
              <PassengersContainer expanded={expandedCars[car.id]}>
                <Car
                  id={car.id}
                  name={car.name}
                  capacity={car.capacity}
                  passengers={car.passengers}
                  onAssignPerson={onAssignPerson}
                  onUnassignPerson={onUnassignPerson}
                  searchTerm={searchTerm}
                  foundPerson={foundPerson}
                  highlight={foundPerson && 
                    foundPerson.location === 'assigned' && 
                    foundPerson.carId === car.id}
                />
              </PassengersContainer>
            </CarSection>
          );
        }).filter(Boolean)}
      </CarsContainer>
    </Container>
  );
}

export default CarList;