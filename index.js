const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
 
const promiseToRead = require('./promiseToRead');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const READING_PATH = fs.readFile('./talker.json', 'utf-8');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  const talkers = await promiseToRead(fs.readFile('./talker.json', 'utf-8'));
  if (talkers.length < 1) return res.status(200).json([]);
  res.status(200).send(JSON.parse(talkers));
});

/* app.get('/talker', async (req, res) => {
  try {
    const talker = await fs.readFile('./talker.json');
    res.status(200).json(JSON.parse(talker));
  } catch (error) {
    res.status(200).json([]);
  }
}); */

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await promiseToRead(READING_PATH);

  const result = talkers.find((person) => person.id === Number(id));

  if (!result) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(HTTP_OK_STATUS).json(result);
});
