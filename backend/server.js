const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { processStrings } = require('./GameLogic'); // Import the game logic

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/process-strings', async (req, res) => {
  const { string1, string2 } = req.body;

  try {
    const result = await processStrings(string1, string2);
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
