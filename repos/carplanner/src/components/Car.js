import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import Person from './Person';

const CarContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s, background-color 0.2s;
  border: 1px solid hsl(210 100% 70% / 1);
  background: hsl(210 98% 92% / 1);
  min-height: 210px;
  width: 100%;

  ${(props) =>
    props.isOver &&
    !props.isFull &&
    `
    box-shadow: 0 0 0 2px #59bdff, 0 4px 10px rgba(0, 0, 0, 0.12);
    background-color: #f0f8ff;
  `}

  ${(props) =>
    props.isFull &&
    `
    border: 1px solid hsl(100 50% 70% / 1);
    background-color: hsl(100 50% 90% / 1);
  `}
`;

const CarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CarName = styled.h3`
  margin: 0;
  color: #444240;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.95rem;
`;

const CarCapacity = styled.div`
  font-weight: ${(props) => (props.filled >= props.capacity ? '700' : '600')};
  padding: 0.25rem 0.5rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-family: 'Montserrat', sans-serif;
  border: 1px solid ${(props) => (props.filled >= props.capacity ? '#f59e0b' : 'hsl(210 100% 75% / 1)')};
  letter-spacing: 1.5px;
  background-color: #fff;

  border-color: ${(props) => (props.filled >= props.capacity ? 'hsl(100 50% 45% / 1)' : 'hsl(210 87% 75% / 1)')};
  color: ${(props) => (props.filled >= props.capacity ? 'hsl(100 50% 45% / 1)' : 'hsl(210 87% 45% / 1)')};
`;

const PassengerList = styled.div`
  min-height: 100px;
  background-color: ${(props) => (props.isOver ? '#f0f8ff' : 'transparent')};
  border-radius: 0.25rem;
  padding: ${(props) => (props.isEmpty ? '0' : '0.5rem 0')};
  height: calc(100% - 42px);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.75rem;
  width: 100%;
`;

const EmptyState = styled.div`
  text-align: center;
  border: 2px dashed ${(props) => (props.isFull ? '#e0e0e0' : 'hsl(210 100% 73% / 1)')};
  border-radius: 10px;
  font-style: italic;
  background-color: ${(props) => (props.isFull ? '#f9f9f9' : '#fff')};
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${(props) => (props.isFull ? '#999' : 'inherit')};
`;

function Car({ id, name, capacity, passengers, onAssignPerson, onUnassignPerson, searchTerm, foundPerson, highlight = false }) {
  const isFull = passengers.length >= capacity;

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ['PERSON', 'ASSIGNED_PERSON'],
      canDrop: (item) => {
        // Allow drops if car is not full OR if moving from another car
        return !isFull || (item.inRoom && item.roomId !== id);
      },
      drop: (item) => {
        // Handle drop based on source
        if (item.inRoom && item.roomId && item.roomId !== id) {
          // IMPORTANT: When moving between cars, we need to be very careful
          // about the state update sequence

          // Create a custom event to handle the car-to-car transfer
          window.dispatchEvent(
            new CustomEvent('car-to-car-transfer', {
              detail: {
                personId: item.id,
                fromCarId: item.roomId,
                toCarId: id,
              },
            }),
          );
        } else if (!item.inRoom) {
          // For drops from the person list, just use the normal assign function
          onAssignPerson(item.id, id);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [id, onAssignPerson, onUnassignPerson, isFull],
  );

  return (
    <CarContainer isOver={isOver} capacity={capacity} isFull={isFull} highlight={highlight}>
      <CarHeader>
        <CarName>Locuri disponibile</CarName>
        <CarCapacity filled={passengers.length} capacity={capacity}>
          {passengers.length}/{capacity}
        </CarCapacity>
      </CarHeader>

      <PassengerList ref={drop} isOver={isOver} isEmpty={passengers.length === 0}>
        {passengers.length > 0 ? (
          passengers.map((passenger) => {
            // Determine if this person should be highlighted
            const shouldHighlight =
              (foundPerson && foundPerson.person.id === passenger.id) ||
              (searchTerm && passenger.name.toLowerCase().includes(searchTerm.toLowerCase()));

            return (
              <Person
                key={passenger.id}
                id={passenger.id}
                name={passenger.name}
                inRoom={true}
                roomId={id}
                onUnassign={onUnassignPerson}
                fromWho={passenger.fromWho}
                highlight={shouldHighlight}
                notes={passenger.notes}
              />
            );
          })
        ) : (
          <EmptyState isFull={isFull}>
            {isFull ? 'Mașina este plină' : 'Trage pasagerii aici'}
          </EmptyState>
        )}
      </PassengerList>
    </CarContainer>
  );
}

export default Car;