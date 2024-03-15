import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PokemonDetails() {
    // Use Pokemon ID from the URL to fetch the details
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);

    // Fetching Pokemon details from the server
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

    // Display loading message while fetching data
    if (!pokemon) return <div>Loading...</div>;

    return (
        <div>
            <h2>{pokemon.name.english}</h2>
            <img src={`/assets/images/${String(pokemon.id).padStart(3, '0')}.png`} alt={pokemon.name.english} />
            <p>Type: {pokemon.type.join(', ')}</p>
            <p>HP: {pokemon.base.HP}</p>
            <p>Attack: {pokemon.base.Attack}</p>
            <p>Defense: {pokemon.base.Defense}</p>
            <p>Sp. Attack: {pokemon.base.SpAttack}</p>
            <p>Sp. Defense: {pokemon.base.SpDefense}</p>
            <p>Speed: {pokemon.base.Speed}</p>
        </div>
    );
}

export default PokemonDetails;