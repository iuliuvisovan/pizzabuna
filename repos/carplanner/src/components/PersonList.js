import styled from 'styled-components';
import Person from './Person';
import { useDrop } from 'react-dnd';
import { useState, useEffect } from 'react';

const Container = styled.div`
  flex: 1;
  background-color: #fffd;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 300px;
  flex: 0.5;
  border: 1px solid #e0e6f0;
  overflow: hidden;
  transition: flex 0.3s ease;
  ${props => props.isCollapsed && `
    flex: 0.25;
  `}
  ${props => props.isOver && `
    box-shadow: 0 0 0 2px #ffbd59, 0 4px 10px rgba(0, 0, 0, 0.12);
    background-color: #fff8f0;
  `}
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e0e6f0;
  padding-bottom: 0.75rem;
  margin-bottom: 1.25rem;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 0;
  color: #444240;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #666;
  padding: 0 8px;
  &:hover {
    color: #333;
  }
`;

const List = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 16px 32px;
  margin: -16px -32px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const EmptyState = styled.div`
  color: #444240;
  text-align: center;
  padding: 2rem;
  font-style: italic;
  background-color: #f7f9fc;
  border-radius: 0.5rem;
  border: 2px dashed #ffbf47;
  font-family: 'Montserrat', sans-serif;
`;

// Removed SearchResult component as per client request

function PersonList({ people, searchTerm, foundPerson }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ASSIGNED_PERSON',
    drop: (item) => {
      if (item.roomId) {
        // Find the room to unassign from
        window.dispatchEvent(new CustomEvent('unassign-person', { 
          detail: { personId: item.id, roomId: item.roomId } 
        }));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), []);

  // Auto-collapse when a person is found in this list
  useEffect(() => {
    if (foundPerson && foundPerson.location === 'unassigned') {
      setIsCollapsed(true);
    }
  }, [foundPerson]);

  // Toggle collapsed state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Highlight the found person in the list
  const renderPeople = () => {
    if (people.length === 0) {
      return <EmptyState>Toți invitații au fost distribuiți!</EmptyState>;
    }

    // If we found a person and it's in the unassigned list
    if (foundPerson && foundPerson.location === 'unassigned') {
      // Show only the found person
      const person = foundPerson.person;
      return (
        <Person 
          key={person.id} 
          id={person.id} 
          name={person.name} 
          fromWho={person.fromWho} 
          inRoom={false}
          highlight={true}
          notes={person.notes}
          numberOfNights={person.numberOfNights}
        />
      );
    }

    // Show all people (with highlighting if search term matches)
    return people.map((person) => {
      const shouldHighlight = searchTerm && 
        person.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return (
        <Person 
          key={person.id} 
          id={person.id} 
          name={person.name} 
          fromWho={person.fromWho} 
          inRoom={false}
          highlight={shouldHighlight}
          notes={person.notes}
          numberOfNights={person.numberOfNights}
        />
      );
    });
  };

  return (
    <Container ref={drop} isOver={isOver} isCollapsed={isCollapsed}>
      <TitleContainer>
        <Title>Invitați</Title>
        <CollapseButton onClick={toggleCollapse}>
          {isCollapsed ? '→' : '←'}
        </CollapseButton>
      </TitleContainer>
      <List>
        {renderPeople()}
      </List>
    </Container>
  );
}

export default PersonList;
