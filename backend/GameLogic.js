const { Pool } = require('pg');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'llama3.2:3b';

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'miASDjua99Q!dsaA!',
  port: 5432, // Default PostgreSQL port
});

pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL successfully!');
    client.release();
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err.stack);
  });

async function callLLM(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false })
  });
  const data = await response.json();
  console.log('Ollama API response:', data);
  return data.response?.trim() || '';
}

async function checkIfExists(first, second) {
  try {
    const result = await pool.query(
      'SELECT * FROM combination WHERE first = $1 AND second = $2',
      [first, second]
    );

    if (result.rows.length > 0) {
      console.log('Match found:', result.rows[0]);
      return { exists: true, data: result.rows[0] };
    } else {
      console.log('No match found.');
      return { exists: false };
    }
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
}

async function checkIfValidWords(first, second) {
  let result1, result2;
  try {
    result1 = await pool.query(
      'SELECT * FROM combination WHERE result = $1',
      [first]
    );
    result2 = await pool.query(
      'SELECT * FROM combination WHERE result = $1',
      [second]
    );
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
  console.log('Word validity check:', first, 'exists:', result1.rows.length > 0, ',', second, 'exists:', result2.rows.length > 0);
  return (result1.rows.length > 0) && (result2.rows.length > 0);
}

// Function to process the strings
async function processStrings(string1, string2) {
  console.log('############ Processing strings:', string1, string2 ,'############');
  if (!string1 || !string2) {
    console.log('Both strings are required.');
    throw new Error('Both strings are required.');
  }

  string1 = string1.toLowerCase();
  string2 = string2.toLowerCase();

  // Ensure smallest value is first
  const [first, second] = string1 <= string2
    ? [string1, string2]
    : [string2, string1];


  console.log('Checking if exists for:', first, second);
  const result = await checkIfExists(first, second);
  if (result.exists) {
    console.log('Found existing combination in DB:', result.data.result);
    const dbWord = result.data.result;
    return dbWord.charAt(0).toUpperCase() + dbWord.slice(1).toLowerCase();
  }

  // Check if first and second in db
  console.log('Checking validity of words:', first, second);
  const valid = await checkIfValidWords(first, second);
  if(!valid) {
    console.log('One or both words are not valid.');
    throw new Error('One or both words are not valid.');
  }
  console.log('Both words are valid.');

  // query database for prevous results
  results = await pool.query('SELECT result FROM combination');

  // 🔹 LLM logic with await
  llmQuery = `You are a word combination engine for an alchemy puzzle game, similar to Little Alchemy.
Your job: given two words, output the single most obvious, common, everyday English noun that people would naturally expect from combining them.

Guidelines:
- Output ONE word only. No punctuation, no explanation, nothing else.
- Prefer simple, well-known nouns that a child would recognise (e.g. steam, mud, smoke, lava, storm).
- The result should feel inevitable and satisfying, not surprising or abstract.
- Never output one of the two input words as the result.
- Never output made-up words, adjectives, verbs, or abstract concepts.
- Do not use one of the following: ${results.rows.map(r => r.result).join(', ')}.

Now output the single best result word for:
${first} + ${second} =`;

  console.log('Calling LLM: ', llmQuery);

  let resultFromLLM = await callLLM(llmQuery);

  console.log('LLM raw result:', resultFromLLM);

  // format response
  resultFromLLM = resultFromLLM.replace(/[^a-zA-Z\s]/g, '').trim();
  resultFromLLM = resultFromLLM.split(/\s+/)[0] || '';
  resultFromLLM = resultFromLLM.charAt(0).toUpperCase() + resultFromLLM.slice(1).toLowerCase();
  console.log('Formatted LLM result:', resultFromLLM);

  if (!resultFromLLM) {
    throw new Error('LLM returned an empty result after formatting.');
  }

  // Store new combination in DB
  try {
    await pool.query(
      'INSERT INTO combination (first, second, result) VALUES ($1, $2, $3)',
      [first, second, resultFromLLM.toLowerCase()]
    );
    console.log('Stored new combination in DB:', first, '+', second, '=', resultFromLLM);
  } catch (err) {
    console.error('Failed to store combination in DB:', err);
  }

  return resultFromLLM;
}

module.exports = { processStrings };