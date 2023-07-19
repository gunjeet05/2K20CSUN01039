const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;


const uniqueNumbers = new Set();


function extractNumbers(jsonObject) {
  const numbers = [];
  function extract(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'number') {
        numbers.push(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        extract(obj[key]);
      }
    }
  }
  extract(jsonObject);
  return numbers;
}

app.get('/numbers', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Please provide at least one valid URL.' });
  }

  try {
    
    const urls = Array.isArray(url) ? url : [url];

    for (const url of urls) {
      
      const response = await axios.get(url);

     
      const numbers = extractNumbers(response.data);

      
      numbers.forEach((number) => uniqueNumbers.add(number));
    }

    
    const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);

    res.json({ numbers: sortedNumbers });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching data from the provided URL(s).' });
  }
});

app.listen(port, () => {
  console.log(`Query Management Service is running on port ${port}`);
});
