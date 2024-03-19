import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonData } from './Context';
import './PokemonTable.css';

// Define a component to display the sorting arrows
const SortArrows = () => (
    <img src="/assets/arrows/sortingArrows.png" alt="Sort" className="sort-arrow" style={{ width: '16px', height: '16px' }} />
);

const PokemonTable = () => {
    // Defining the states for getting the list of Pokemons, searching, sorting, filtering, and pagination
    const { pokemons } = usePokemonData();
    const [search, setSearch] = useState(sessionStorage.getItem('search') || '');
    const [sortKey, setSortKey] = useState(sessionStorage.getItem('sortKey') || 'id');
    const [sortDirection, setSortDirection] = useState(sessionStorage.getItem('sortDirection') || 'asc');
    const [filter, setFilter] = useState(sessionStorage.getItem('filter') || '');
    const [currentPage, setCurrentPage] = useState(parseInt(sessionStorage.getItem('currentPage') || '1', 10));
    const itemsPerPage = 100;

    // Save the search, sortKey, sortDirection, filter, and currentPage to sessionStorage
    useEffect(() => {
        sessionStorage.setItem('search', search);
        sessionStorage.setItem('sortKey', sortKey);
        sessionStorage.setItem('sortDirection', sortDirection);
        sessionStorage.setItem('filter', filter);
        sessionStorage.setItem('currentPage', currentPage.toString());
    }, [search, sortKey, sortDirection, filter, currentPage]);

    // Event handlers for searching
    const handleSearchChange = (event) => {
        setSearch(event.target.value.toLowerCase());
        setCurrentPage(1);
    };

    // Event handlers for filtering
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(1);
    };

    // Event handlers for sorting
    const handleSortChange = (key) => {
        if (sortKey === key) {
            setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
        setCurrentPage(1);
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

    // Function to determine if the column is the sorted column
    const isSorted = (key) => sortKey === key;

    // Implement pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPokemons = sortedAndFilteredPokemons.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate the total number of pages based on the filtered list
    const totalPages = Math.ceil(sortedAndFilteredPokemons.length / itemsPerPage);

    // Create an array of page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Ensure the current page is not greater than the total number of pages
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    return (
        <div className="table-container">
            <h1 className="title">
                International Pokémon Pokedex
            </h1>
            <div className="search-filter-container">
                <span className="search-label">Name:</span>
                <input
                    id="searchInput"
                    type="text"
                    placeholder="Search Pokemon"
                    value={search}
                    onChange={handleSearchChange}
                    className="search-input" />
                <label htmlFor="typeSelect" className="filter-label">Type:</label>
                <select
                    id="typeSelect"
                    value={filter}
                    onChange={handleFilterChange}
                    className="filter-select">
                    <option value="">- All -</option>
                    {["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"].map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSortChange('id')} className={isSorted('id') ? 'sorted-header' : ''}>
                            # <SortArrows className="sort-arrow" />
                        </th>
                        <th onClick={() => handleSortChange('name')} className={isSorted('name') ? 'sorted-header' : ''}>
                            Name <SortArrows className="sort-arrow" />
                        </th>
                        <th>Type</th>
                        <th onClick={() => handleSortChange('total')} className={isSorted('total') ? 'sorted-header' : ''}>
                            Total <SortArrows className="sort-arrow" />
                        </th>
                        <th onClick={() => handleSortChange('HP')} className={isSorted('HP') ? 'sorted-header' : ''}>
                            HP <SortArrows className="sort-arrow" />
                        </th>
                        <th onClick={() => handleSortChange('Attack')} className={isSorted('Attack') ? 'sorted-header' : ''}>
                            Attack <SortArrows className="sort-arrow" />
                        </th>
                        <th onClick={() => handleSortChange('Defense')} className={isSorted('Defense') ? 'sorted-header' : ''}>
                            Defense <SortArrows className="sort-arrow" />
                        </th>
                        <th onClick={() => handleSortChange('Sp. Attack')} className={isSorted('Sp. Attack') ? 'sorted-header' : ''}>
                            Sp. Atk <SortArrows className="sort-arrow" />
                        </th>
                        <th onClick={() => handleSortChange('Sp. Defense')} className={isSorted('Sp. Defense') ? 'sorted-header' : ''}>
                            Sp. Def <SortArrows className="sort-arrow" />
                        </th>
                        <th onClick={() => handleSortChange('Speed')} className={isSorted('Speed') ? 'sorted-header' : ''}>
                            Speed <SortArrows className="sort-arrow" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentPokemons.map((pokemon, index) => (
                        <tr key={index}>
                            <td>
                                <img src={`./assets/sprites/${String(pokemon.id).padStart(3, '0')}MS.png`} alt={pokemon.name.english} />
                                {pokemon.id}
                            </td>
                            <td>
                                <Link to={`/pokemon/${pokemon.id}`}>{pokemon.name.english}</Link>
                            </td>
                            <td>
                                {pokemon.type.map((type, index) => (
                                    <span key={index} className={`type ${type.toLowerCase()}`}>
                                        {type}
                                    </span>
                                ))}
                            </td>
                            <td className="total-value">{calculateTotal(pokemon.base)}</td>
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
            <div className="pagination">
                {currentPage > 1 && (
                    <a href="#!" className='page-link' onClick={() => setCurrentPage(currentPage - 1)}>&laquo;</a>
                )}
                {pageNumbers.map(number => (
                    <a key={number} href="#!" className={`page-link ${currentPage === number ? 'active' : ''}`} onClick={() => setCurrentPage(number)}>
                        {number}
                    </a>
                ))}
                {currentPage < totalPages && (
                    <a href="#!" className='page-link' onClick={() => setCurrentPage(currentPage + 1)}>&raquo;</a>
                )}
            </div>
            <div className="spacer"></div>
        </div>
    );
};

export default PokemonTable;