const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
 
const promiseToRead = require('./promiseToRead');
const authMiddleware = require('./authMiddleware');
const generateToken = require('./generateToken');
const { validateName, validateAge, validateTalk, validateWatchedAt,
  validateRate,
} = require('./validateBody');
const validateToken = require('./validateToken');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  const talkers = JSON.parse(await promiseToRead(fs.readFile('./talker.json', 'utf-8')));
  if (talkers.length < 1) return res.status(200).json([]);
  return res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = JSON.parse(await promiseToRead(fs.readFile('./talker.json', 'utf-8')));

  const result = talkers.find((person) => person.id === Number(id));

  if (!result) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(HTTP_OK_STATUS).json(result);
});

app.post('/login', authMiddleware, (_req, res) => {
  const keyToken = generateToken();
  return res.status(200).json({ token: keyToken });
});

app.post('/talker', validateToken,
  validateName, validateAge, validateTalk, validateRate, validateWatchedAt, 
    async (req, res) => {
      const { name, age, talk } = req.body;
    const talkers = JSON.parse(await fs.readFile('./talker.json'));
    talkers.push({
      id: talkers.length + 1,
      name,
      age,
      talk,
    });

    await fs.writeFile('./talker.json', JSON.stringify(talkers));
    return res.status(201).json({
      id: talkers.length,
      name,
      age,
      talk,
  });
  });
