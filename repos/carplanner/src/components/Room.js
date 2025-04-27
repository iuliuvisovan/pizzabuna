import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import Person from './Person';

const RoomContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s, background-color 0.2s;
  border: 1px solid hsl(36 100% 70% / 1);
  background: hsl(41 98% 92% / 1);
  height: ${(props) => (props.capacity === 3 ? '270px' : '210px')};

  /* No highlight needed for the room container */

  ${(props) =>
    props.isOver &&
    !props.isFull &&
    `
    box-shadow: 0 0 0 2px #ffbd59, 0 4px 10px rgba(0, 0, 0, 0.12);
    background-color: #fff8f0;
  `}

  ${(props) =>
    props.isFull &&
    `
    border: 1px solid hsl(100 50% 70% / 1);
    background-color: hsl(100 50% 90% / 1);
  `}
`;

const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const RoomName = styled.h3`
  margin: 0;
  color: #444240;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.95rem;
`;

const RoomCapacity = styled.div`
  font-weight: ${(props) => (props.filled >= props.capacity ? '700' : '600')};
  padding: 0.25rem 0.5rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-family: 'Montserrat', sans-serif;
  border: 1px solid ${(props) => (props.filled >= props.capacity ? '#f59e0b' : 'hsl(32 100% 75% / 1)')};
  letter-spacing: 1.5px;
  background-color: #fff;

  border-color: ${(props) => (props.filled >= props.capacity ? 'hsl(100 50% 45% / 1)' : 'hsl(39 87% 75% / 1)')};
  color: ${(props) => (props.filled >= props.capacity ? 'hsl(100 50% 45% / 1)' : 'hsl(39 87% 45% / 1)')};
`;

const GuestList = styled.div`
  min-height: ${(props) => (props.capacity === 3 ? '140px' : '100px')};
  background-color: ${(props) => (props.isOver ? '#fff8f0' : 'transparent')};
  border-radius: 0.25rem;
  padding: ${(props) => (props.isEmpty ? '0' : '0.5rem 0')};
  height: calc(100% - 42px);
`;

const EmptyState = styled.div`
  text-align: center;
  border: 2px dashed ${(props) => (props.isFull ? '#e0e0e0' : 'hsl(32 100% 73% / 1)')};
  border-radius: 10px;
  font-style: italic;
  background-color: ${(props) => (props.isFull ? '#f9f9f9' : '#fff')};
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${(props) => (props.isFull ? '#999' : 'inherit')};
`;

function Room({ id, name, capacity, guests, onAssignPerson, onUnassignPerson, searchTerm, foundPerson, highlight = false }) {
  const isFull = guests.length >= capacity;

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ['PERSON', 'ASSIGNED_PERSON'],
      canDrop: (item) => {
        // Allow drops if room is not full OR if moving from another room
        return !isFull || (item.inRoom && item.roomId !== id);
      },
      drop: (item) => {
        // Handle drop based on source
        if (item.inRoom && item.roomId && item.roomId !== id) {
          // IMPORTANT: When moving between rooms, we need to be very careful
          // about the state update sequence

          // First, remove from the original room without adding to unassigned list
          // Create a custom event to handle the room-to-room transfer
          window.dispatchEvent(
            new CustomEvent('room-to-room-transfer', {
              detail: {
                personId: item.id,
                fromRoomId: item.roomId,
                toRoomId: id,
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

  // Removed SearchResult component as per client request

  return (
    <RoomContainer isOver={isOver} capacity={capacity} isFull={isFull} highlight={highlight}>
      <RoomHeader>
        <RoomName>{name}</RoomName>
        <RoomCapacity filled={guests.length} capacity={capacity}>
          {guests.length}/{capacity}
        </RoomCapacity>
      </RoomHeader>

      <GuestList ref={drop} isOver={isOver} isEmpty={guests.length === 0} capacity={capacity}>
        {guests.length > 0 ? (
          guests.map((guest) => {
            // Determine if this person should be highlighted
            const shouldHighlight =
              (foundPerson && foundPerson.person.id === guest.id) ||
              (searchTerm && guest.name.toLowerCase().includes(searchTerm.toLowerCase()));

            return (
              <Person
                key={guest.id}
                id={guest.id}
                name={guest.name}
                inRoom={true}
                roomId={id}
                onUnassign={onUnassignPerson}
                fromWho={guest.fromWho}
                highlight={shouldHighlight}
                notes={guest.notes}
                numberOfNights={guest.numberOfNights}
              />
            );
          })
        ) : (
          <EmptyState capacity={capacity} isFull={isFull}>
            {isFull ? 'Camera este plină' : 'Trage invitații aici'}
          </EmptyState>
        )}
      </GuestList>
    </RoomContainer>
  );
}

export default Room;
