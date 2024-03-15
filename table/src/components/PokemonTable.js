import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonTable = () => {
    const [pokemons, setPokemons] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios('http://localhost:3000/api/pokemon');
                setPokemons(result.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const handleSearchChange = (event) => {
        setSearch(event.target.value.toLowerCase());
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredPokemons = pokemons.filter(pokemon =>
        pokemon.name.english.toLowerCase().includes(search) &&
        (filter ? pokemon.type.includes(filter) : true)
    );

    return (
        <div>
            <input type="text" placeholder="Search Pokemon" onChange={handleSearchChange} />
            <select onChange={handleFilterChange}>
                <option value="">All Types</option>
                {["Fire", "Water", "Grass"].map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Total</th>
                        <th>HP</th>
                        <th>Attack</th>
                        <th>Defense</th>
                        <th>Sp. Attack</th>
                        <th>Sp. Defense</th>
                        <th>Speed</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPokemons.map((pokemon, index) => (
                        <tr key={index}>
                            <td>
                                <img src={`./assets/sprites/${pokemon.id}MS.png`} alt={pokemon.name.english} />
                                {pokemon.id}
                            </td>
                            <td>{pokemon.name.english}</td>
                            <td>{pokemon.type.join(', ')}</td>
                            <td>{Object.values(pokemon.base).reduce((a, b) => a + b, 0)}</td>
                            {Object.values(pokemon.base).map((value, idx) => (
                                <td key={idx}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PokemonTable;