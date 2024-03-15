const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Load Pokemon data
const filePath = path.join(__dirname, '../data/pokedex.json');
const pokemonData = JSON.parse(fs.readFileSync(filePath));

// Updated GraphQL schema
const schema = buildSchema(`
  type Query {
    pokemonById(id: Int!): Pokemon
  }
  type Pokemon {
    id: Int
    name: Name
    type: [String]
    base: Base
  }
  type Name {
    english: String
    japanese: String
    chinese: String
    french: String
  }
  type Base {
    HP: Int
    Attack: Int
    Defense: Int
    SpAttack: Int
    SpDefense: Int
    Speed: Int
  }
`);

// Updated resolver root
const root = {
  pokemonById: ({ id }) => {
    const pokemon = pokemonData.find(p => p.id === id);
    return {
      ...pokemon,
      base: {
        HP: pokemon.base.HP,
        Attack: pokemon.base.Attack,
        Defense: pokemon.base.Defense,
        SpAttack: pokemon.base["Sp. Attack"],
        SpDefense: pokemon.base["Sp. Defense"],
        Speed: pokemon.base.Speed,
      }
    };
  }
};

// Returns array of all Pokemon and their data
app.get('/api/pokemon', (req, res) => {
  res.json(pokemonData);
});

// GraphQL endpoint setup
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));