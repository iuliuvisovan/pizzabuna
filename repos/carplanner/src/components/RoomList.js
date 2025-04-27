import styled from 'styled-components';
import Room from './Room';

const Container = styled.div`
  flex: 2;
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  max-height: 100%;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #4f46e5;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.75rem;
  margin-bottom: 1.25rem;
`;

const RoomsContainer = styled.div`
  overflow-y: auto;
  flex: 1;
`;

function RoomList({ rooms, onAssignPerson, onUnassignPerson }) {
  return (
    <Container>
      <Title>Available Rooms</Title>
      <RoomsContainer>
        {rooms.map((room) => (
          <Room
            key={room.id}
            id={room.id}
            name={room.name}
            capacity={room.capacity}
            guests={room.guests}
            onAssignPerson={onAssignPerson}
            onUnassignPerson={onUnassignPerson}
          />
        ))}
      </RoomsContainer>
    </Container>
  );
}

export default RoomList;
