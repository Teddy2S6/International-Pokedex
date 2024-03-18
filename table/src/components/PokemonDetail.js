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
    if (!pokemon) return <div>Loading...</div>;

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
                    <img className="pokemon-sprite" src={`/assets/sprites/${String(pokemon.id).padStart(3, '0')}MS.png`} alt={pokemon.name.english} />
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
                <h3 className="stats-title">Base Stats</h3>
                <div className="stats-container">
                    <p>HP: {pokemon.base.HP}</p>
                    <p>Attack: {pokemon.base.Attack}</p>
                    <p>Defense: {pokemon.base.Defense}</p>
                    <p>Sp. Attack: {pokemon.base.SpAttack}</p>
                    <p>Sp. Defense: {pokemon.base.SpDefense}</p>
                    <p>Speed: {pokemon.base.Speed}</p>
                </div>
            </div>
            <div className="bottom-row">
                <button className="back-button" onClick={goToPokemonTable}>Back to Pokemon List</button>
            </div>
        </div>
    );
}

export default PokemonDetail;