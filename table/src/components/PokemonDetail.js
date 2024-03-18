import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PokemonDetail.css';

function PokemonDetail() {
    // Defining states to manage the Pokemon details
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const navigate = useNavigate();

    // Fetching Pokemon details using GraphQL query
    useEffect(() => {
        const fetchPokemonDetails = async () => {
            const query = JSON.stringify({
                query: `{
                    pokemonById(id: ${id}) {
                        id
                        name {
                            english
                            japanese
                            chinese
                            french
                        }
                        type
                        base {
                            HP
                            Attack
                            Defense
                            SpAttack
                            SpDefense
                            Speed
                        }
                    }
                }`,
            });

            try {
                const response = await axios.post('http://localhost:3000/graphql', query, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setPokemon(response.data.data.pokemonById);
            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
            }
        };
        fetchPokemonDetails();
    }, [id]);

    // Function to navigate user to the next Pokémon's detail page
    const goToNextPokemon = () => {
        if (parseInt(id) === 809) {
            const nextPokemonId = 1;
            navigate(`/pokemon/${nextPokemonId}`);
        } else {
            const nextPokemonId = parseInt(id) + 1;
            navigate(`/pokemon/${nextPokemonId}`);
        }
    };

    // Function to navigate user to the previous Pokémon's detail page
    const goToPreviousPokemon = () => {
        if (parseInt(id) === 1) {
            const previousPokemonId = 809;
            navigate(`/pokemon/${previousPokemonId}`);
        } else {
            const previousPokemonId = parseInt(id) - 1;
            navigate(`/pokemon/${previousPokemonId}`);
        }
    };

    // Function to navigate user to the Pokemon Table
    const goToPokemonTable = () => {
        navigate('/', { state: { scrollPosition: window.pageYOffset } });
    };

    // Display loading message while fetching data
    if (!pokemon) return <div className="loading">Loading...</div>;

    return (
        <div className="pokemon-card">
            <div className="title-row">
                <button className="nav-button" onClick={goToPreviousPokemon}>Previous Pokemon</button>
                <h2 className="pokemon-name">{pokemon.name.english}</h2>
                <button className="nav-button" onClick={goToNextPokemon}>Next Pokemon</button>
            </div>
            <div className="center">
                <div className="center-left">
                    <img className="pokemon-image" src={`/assets/images/${String(pokemon.id).padStart(3, '0')}.png`} alt={pokemon.name.english} />
                </div>
                <div className="center-right">
                    <p className="pokemon-number">No. {pokemon.id}</p>
                    <div className="pokemon-types">
                        {pokemon.type.map((type, index) => (
                            <span key={index} className={`type ${type.toLowerCase()}`}>
                                {type}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="center-bottom">
                <div className="stats-container">
                    <div className="stats-left">
                        <h3 className="stats-left-title">Base Stats:</h3>
                        <p>HP: {pokemon.base.HP}</p>
                        <p>Attack: {pokemon.base.Attack}</p>
                        <p>Defense: {pokemon.base.Defense}</p>
                        <p>Sp. Attack: {pokemon.base.SpAttack}</p>
                        <p>Sp. Defense: {pokemon.base.SpDefense}</p>
                        <p>Speed: {pokemon.base.Speed}</p>
                    </div>
                    <div className="stats-right">
                        <h3 className="stats-right-title">Also Called:</h3>
                        <p>Japanese: {pokemon.name.japanese}</p>
                        <p>Chinese: {pokemon.name.chinese}</p>
                        <p>French: {pokemon.name.french}</p>
                    </div>
                </div>
            </div>
            <div className="bottom-row">
                <button className="back-button" onClick={goToPokemonTable}>Back to Pokemon List</button>
            </div>
        </div>
    );
}

export default PokemonDetail;