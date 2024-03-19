import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { PokemonDataProvider } from './components/Context';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <PokemonDataProvider>
      <App />
    </PokemonDataProvider>
  </React.StrictMode>,
  document.getElementById('root')
);