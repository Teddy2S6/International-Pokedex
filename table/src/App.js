import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PokemonTable from './components/PokemonTable';
import PokemonDetail from './components/PokemonDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PokemonTable />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
}

export default App;