import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context to store the list of Pokemon
const PokemonDataContext = createContext();

// Create a custom hook to consume the PokemonDataContext
export const usePokemonData = () => useContext(PokemonDataContext);

export const PokemonDataProvider = ({ children }) => {
  // Define a state to store the list of Pokemon
  const [pokemons, setPokemons] = useState(() => {
    const savedPokemons = localStorage.getItem('pokemons');
    return savedPokemons ? JSON.parse(savedPokemons) : [];
  });

  // Fetch the list of Pokemon from the server
  useEffect(() => {
    if (pokemons.length === 0) {
      axios.get('http://localhost:5000/api/pokemon')
        .then(result => {
          setPokemons(result.data);
          localStorage.setItem('pokemons', JSON.stringify(result.data));
        })
        .catch(console.error);
    }
  }, [pokemons]);

  return (
    <PokemonDataContext.Provider value={{ pokemons, setPokemons }}>
      {children}
    </PokemonDataContext.Provider>
  );
};