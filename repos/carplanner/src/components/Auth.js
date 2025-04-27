import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #fff5d7;
  font-family: 'Montserrat', sans-serif;
`;

const AuthBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Emoji = styled.span`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #ffdb58;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 219, 88, 0.3);
  }
`;

const LoginButton = styled.button`
  background-color: #ffdb58;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #ffcd00;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 1rem;
`;

const Auth = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Check if already authenticated
    const savedPassword = localStorage.getItem('passwordSaved');
    if (savedPassword === 'true') {
      onAuthenticated();
    }
  }, [onAuthenticated]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === 'puianscumpelan') {
      // Save authentication state
      localStorage.setItem('passwordSaved', 'true');
      onAuthenticated();
    } else {
      setError('Parola incorectă. Încercați din nou.');
      setPassword('');
    }
  };
  
  return (
    <AuthContainer>
      <AuthBox>
        <Emoji>🐥</Emoji>
        <Title>Please insert the password Mrs. Pui</Title>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <PasswordInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introduceți parola..."
            autoFocus
          />
          <LoginButton type="submit">Intră</LoginButton>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </AuthBox>
    </AuthContainer>
  );
};

export default Auth;