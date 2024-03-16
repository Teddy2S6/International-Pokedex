import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// SortArrows component
const SortArrows = () => (
    <img src="/assets/arrows/sortingArrows.png" alt="Sort" style={{ width: '16px', height: '16px' }} />
);

const PokemonTable = () => {
    //  // Defining states to manage the list of Pokemon, searching, sorting, and filtering
    const [pokemons, setPokemons] = useState([]);
    const [search, setSearch] = useState(sessionStorage.getItem('search') || '');
    const [sortKey, setSortKey] = useState(sessionStorage.getItem('sortKey') || 'id');
    const [sortDirection, setSortDirection] = useState(sessionStorage.getItem('sortDirection') || 'asc');
    const [filter, setFilter] = useState(sessionStorage.getItem('filter') || '');

    // Fetching data from the server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get('http://localhost:3000/api/pokemon');
                setPokemons(result.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, []);

    // Save to sessionStorage whenever search, filter, or sort state changes
    useEffect(() => {
        sessionStorage.setItem('search', search);
        sessionStorage.setItem('sortKey', sortKey);
        sessionStorage.setItem('sortDirection', sortDirection);
        sessionStorage.setItem('filter', filter);
    }, [search, sortKey, sortDirection, filter]);

    // Event handlers for searching
    const handleSearchChange = (event) => {
        setSearch(event.target.value.toLowerCase());
    };

    // Event handlers for filtering
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    // Event handlers for sorting
    const handleSortChange = (key) => {
        if (sortKey === key) {
            setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    // Calculate total base stats
    const calculateTotal = (base) => {
        return Object.values(base).reduce((acc, cur) => acc + cur, 0);
    };

    // Get the sortable value for each Pokemon
    const getSortableValue = (pokemon, key) => {
        if (key === 'total') return calculateTotal(pokemon.base);
        if (key === 'name') return pokemon.name.english.toLowerCase();
        if (key === 'SpAttack' || key === 'SpDefense') {
            return pokemon.base[key];
        }
        return pokemon.base[key] || pokemon.id;
    };

    // Sorting and filtering the list of Pokemons
    const sortedAndFilteredPokemons = pokemons
        .filter(pokemon => pokemon.name.english.toLowerCase().includes(search) && (!filter || pokemon.type.includes(filter)))
        .sort((a, b) => {
            const valueA = getSortableValue(a, sortKey);
            const valueB = getSortableValue(b, sortKey);

            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <div>
            <input
                type="text"
                placeholder="Search Pokemon"
                value={search}
                onChange={handleSearchChange} />
            <select
                value={filter}
                onChange={handleFilterChange}>
                <option value="">- All -</option>
                {["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"].map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSortChange('id')}># <SortArrows /></th>
                        <th onClick={() => handleSortChange('name')}>Name <SortArrows /></th>
                        <th>Type</th>
                        <th onClick={() => handleSortChange('total')}>Total <SortArrows /></th>
                        <th onClick={() => handleSortChange('HP')}>HP <SortArrows /></th>
                        <th onClick={() => handleSortChange('Attack')}>Attack <SortArrows /></th>
                        <th onClick={() => handleSortChange('Defense')}>Defense <SortArrows /></th>
                        <th onClick={() => handleSortChange('Sp. Attack')}>Sp. Atk <SortArrows /></th>
                        <th onClick={() => handleSortChange('Sp. Defense')}>Sp. Def <SortArrows /></th>
                        <th onClick={() => handleSortChange('Speed')}>Speed <SortArrows /></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAndFilteredPokemons.map((pokemon, index) => (
                        <tr key={index}>
                            <td>
                                <img src={`./assets/sprites/${String(pokemon.id).padStart(3, '0')}MS.png`} alt={pokemon.name.english} />
                                {pokemon.id}
                            </td>
                            <td>
                                <Link to={`/pokemon/${pokemon.id}`}>{pokemon.name.english}</Link>
                            </td>
                            <td>{pokemon.type.join(', ')}</td>
                            <td>{calculateTotal(pokemon.base)}</td>
                            <td>{pokemon.base.HP}</td>
                            <td>{pokemon.base.Attack}</td>
                            <td>{pokemon.base.Defense}</td>
                            <td>{pokemon.base["Sp. Attack"]}</td>
                            <td>{pokemon.base["Sp. Defense"]}</td>
                            <td>{pokemon.base.Speed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PokemonTable;