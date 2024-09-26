import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import PokemonList from './components/PokemonList';
import PokemonDetails from './components/PokemonDetails';
import { ThemeContext } from './context/ThemeContext';
import ToggleSwitch from './context/ToggleSwitch';

const AppContainer = styled.div`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};
  background-image: ${(props) => props.theme.gradient};
  min-height: 100vh;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 45px;
`;

const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <AppContainer>
      <BrowserRouter>
        <Header>
          <Title>Pokédex</Title>
          <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
        </Header>
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
        </Routes>
      </BrowserRouter>
    </AppContainer>
  );
};

export default App;