import { PresetEndpoint } from '../types';

export const PRESET_ENDPOINTS: PresetEndpoint[] = [
  {
    id: 'cat-fact',
    name: 'Cat Facts API',
    category: 'Animals',
    url: 'https://catfact.ninja/fact',
    method: 'GET',
    description: 'Returns a random cat fact in JSON format. CORS supported, zero authentication required.'
  },
  {
    id: 'dog-ceo',
    name: 'Dog CEO API',
    category: 'Animals',
    url: 'https://dog.ceo/api/breeds/image/random',
    method: 'GET',
    description: 'Fetches random pictures of dogs from Stanford Dogs Dataset.'
  },
  {
    id: 'open-meteo',
    name: 'Open-Meteo Weather',
    category: 'Weather',
    url: 'https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current_weather=true',
    method: 'GET',
    description: 'Accurate open-source weather forecast API for San Francisco (lat: 37.77, lon: -122.41).'
  },
  {
    id: 'joke-api',
    name: 'JokeAPI',
    category: 'Entertainment',
    url: 'https://v2.jokeapi.dev/joke/Programming?safe-mode',
    method: 'GET',
    description: 'Curated programming and developer jokes API.'
  },
  {
    id: 'advice-slip',
    name: 'Advice Slip API',
    category: 'Personality',
    url: 'https://api.adviceslip.com/advice',
    method: 'GET',
    description: 'Generates random pieces of thoughtful advice.'
  },
  {
    id: 'ipify',
    name: 'IPify IP Address',
    category: 'Development',
    url: 'https://api.ipify.org?format=json',
    method: 'GET',
    description: 'Simple public IP address lookup service.'
  },
  {
    id: 'agify',
    name: 'Agify.io',
    category: 'Data Validation',
    url: 'https://api.agify.io?name=sarah',
    method: 'GET',
    description: 'Estimates the probable age of a given name based on global demographic data.'
  },
  {
    id: 'nationalize',
    name: 'Nationalize.io',
    category: 'Data Validation',
    url: 'https://api.nationalize.io?name=lucas',
    method: 'GET',
    description: 'Estimates nationality probabilities for a person given first name.'
  },
  {
    id: 'bored-api',
    name: 'Activity / Bored API',
    category: 'Entertainment',
    url: 'https://bored-api.appbrewery.com/random',
    method: 'GET',
    description: 'Suggests random activities and hobbies to fight boredom.'
  },
  {
    id: 'rick-and-morty',
    name: 'The Rick and Morty API',
    category: 'Entertainment',
    url: 'https://rickandmortyapi.com/api/character/1',
    method: 'GET',
    description: 'Information and statistics about Rick Sanchez and the Rick and Morty universe.'
  },
  {
    id: 'pokeapi',
    name: 'PokeAPI',
    category: 'Games & Comics',
    url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
    method: 'GET',
    description: 'Restful Pokémon database API returning Pikachu stats, abilities, and sprites.'
  },
  {
    id: 'coingecko',
    name: 'CoinGecko Status Ping',
    category: 'Cryptocurrency',
    url: 'https://api.coingecko.com/api/v3/ping',
    method: 'GET',
    description: 'Checks server status and connectivity of the CoinGecko public cryptocurrency service.'
  },
  {
    id: 'us-data',
    name: 'Data USA (Census & Population)',
    category: 'Open Data',
    url: 'https://datausa.io/api/data?drilldowns=Nation&measures=Population',
    method: 'GET',
    description: 'Official US public demographic data and historical national population metrics.'
  },
  {
    id: 'zippopotam',
    name: 'Zippopotam.us Geocoding',
    category: 'Geocoding',
    url: 'https://api.zippopotam.us/us/90210',
    method: 'GET',
    description: 'Postal code and geocoding information for Beverly Hills, CA 90210.'
  }
];
