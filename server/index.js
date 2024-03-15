const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Load Pokemon data
const filePath = path.join(__dirname, '../data/pokedex.json');
const pokemonData = JSON.parse(fs.readFileSync(filePath));

// GraphQL schema
const schema = buildSchema(`
  type Query {
    pokemonByName(name: String!): Pokemon
    pokemonByType(type: String!): [Pokemon]
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

// Resolver root
const root = {
  pokemonByName: ({ name }) =>
    pokemonData.find((p) => p.name.english.toLowerCase() === name.toLowerCase()),
  pokemonByType: ({ type }) =>
    pokemonData.filter((p) => p.type.includes(type)),
};

const cors = require('cors');
app.use(cors());

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