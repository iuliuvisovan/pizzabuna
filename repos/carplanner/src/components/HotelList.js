import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Room from './Room';

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

const HotelsContainer = styled.div`
  overflow-y: auto;
  flex: 1;
  padding-right: 0.5rem;
`;

const HotelSection = styled.div`
  margin-bottom: 2rem;
`;

const HotelHeader = styled.div`
  background: linear-gradient(0, hsl(41.02deg 84.69% 64%), #ffcf66);
  color: #4a2500;
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

const HotelName = styled.h3`
  margin: 0;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  align-items: center;
`;

const HotelIcon = styled.span`
  margin-right: 0.75rem;
  font-size: 1.25rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const OccupancyCounter = styled.div`
  background-color: ${props => props.isFull ? '#4ade80' : '#ffde59'};
  color: ${props => props.isFull ? '#166534' : '#4a2500'};
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
  color: #4a2500;
  opacity: 0.7;
`;

const NightsTag = styled.div`
  background-color: #1a237e;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  font-family: 'Montserrat', sans-serif;
  margin-left: 8px;
  display: inline-block;
`;

const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  gap: 1rem;
  padding: 0 0.5rem;
  margin-top: -4px;
  padding-top: 4px;
  max-height: ${(props) => (props.expanded ? '2000px' : '0')};
  overflow: hidden;
  opacity: ${(props) => (props.expanded ? '1' : '0')};
  transition: max-height 0.4s ease-in-out, opacity 0.2s ease-in-out;
  transition-delay: ${(props) => (props.expanded ? '0s, 0.1s' : '0s, 0s')};
`;

function HotelList({ hotels, onAssignPerson, onUnassignPerson, searchTerm, foundPerson }) {
  // State to track which hotels are expanded, with all hotels expanded by default
  const [expandedHotels, setExpandedHotels] = useState(() => {
    // Create an object with all hotels expanded by default
    const expanded = {};
    hotels.forEach(hotel => {
      expanded[hotel.id] = true;
    });
    return expanded;
  });

  const getHotelIcon = (hotelName) => {
    if (hotelName.includes('Elania')) return '🏨';
    if (hotelName.includes('Casa Mari')) return '🏡';
    if (hotelName.includes('View')) return '🏞️';
    if (hotelName.includes('Făget')) return '🌳';
    return '🏘️';
  };

  const toggleHotelExpansion = (hotelId) => {
    setExpandedHotels((prev) => ({
      ...prev,
      [hotelId]: !prev[hotelId],
    }));
  };
  
  // Auto-expand hotel when a person is found in one of its rooms
  useEffect(() => {
    if (foundPerson && foundPerson.location === 'assigned') {
      // Find the hotel that contains the room with the found person
      const hotelWithFoundPerson = hotels.find(hotel => 
        hotel.rooms.some(room => room.id === foundPerson.roomId)
      );
      
      if (hotelWithFoundPerson) {
        setExpandedHotels(prev => ({
          ...prev,
          [hotelWithFoundPerson.id]: true
        }));
      }
    }
  }, [foundPerson, hotels]);

  // Calculate total capacity and occupancy for each hotel
  const getHotelStats = (hotel) => {
    let totalCapacity = 0;
    let totalOccupancy = 0;
    
    hotel.rooms.forEach(room => {
      totalCapacity += room.capacity;
      totalOccupancy += room.guests.length;
    });
    
    return { totalCapacity, totalOccupancy, isFull: totalOccupancy >= totalCapacity };
  };

  return (
    <Container>
      <Title>Cazare Disponibilă</Title>
      <HotelsContainer>
        {hotels.map((hotel) => {
          const { totalCapacity, totalOccupancy, isFull } = getHotelStats(hotel);
          
          // Filter rooms based on search term
          const matchingRooms = searchTerm 
            ? hotel.rooms.filter(room => 
                room.guests.some(guest => 
                  guest.name.toLowerCase().includes(searchTerm.toLowerCase())
                ) || 
                (foundPerson && 
                 foundPerson.location === 'assigned' && 
                 hotel.rooms.some(r => r.id === foundPerson.roomId))
              )
            : hotel.rooms;
          
          // If searching and no matching rooms, skip this hotel entirely
          if (searchTerm && matchingRooms.length === 0) {
            return null;
          }
          
          return (
            <HotelSection key={hotel.id}>
              <HotelHeader onClick={() => toggleHotelExpansion(hotel.id)}>
                <HeaderContent>
                  <HotelIcon>{getHotelIcon(hotel.name)}</HotelIcon>
                  <HotelName>
                    {hotel.name}
                    {hotel.numberOfNights && <NightsTag>{hotel.numberOfNights} 🌙</NightsTag>}
                  </HotelName>
                </HeaderContent>
                <OccupancyCounter isFull={isFull}>
                  {totalOccupancy}/{totalCapacity} locuri ocupate
                </OccupancyCounter>
                <ExpandIcon expanded={expandedHotels[hotel.id]}>▼</ExpandIcon>
              </HotelHeader>
              <RoomsGrid expanded={expandedHotels[hotel.id]}>
                {hotel.rooms.map((room) => {
                  // Check if this room contains the found person
                  const isFoundPersonRoom = foundPerson && 
                    foundPerson.location === 'assigned' && 
                    foundPerson.roomId === room.id;
                  
                  // For search, check if any guest in this room matches the search term
                  const hasMatchingGuest = searchTerm && room.guests.some(
                    guest => guest.name.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  
                  // Only show rooms that match the search criteria if searching
                  if (searchTerm && !hasMatchingGuest && !isFoundPersonRoom) {
                    return null; // Skip rendering this room
                  }
                    
                  return (
                    <Room
                      key={room.id}
                      id={room.id}
                      name={room.name}
                      capacity={room.capacity}
                      guests={room.guests}
                      onAssignPerson={onAssignPerson}
                      onUnassignPerson={onUnassignPerson}
                      searchTerm={searchTerm}
                      foundPerson={foundPerson}
                      highlight={isFoundPersonRoom}
                    />
                  );
                }).filter(Boolean)}
              </RoomsGrid>
            </HotelSection>
          );
        }).filter(Boolean)}
      </HotelsContainer>
    </Container>
  );
}

export default HotelList;
