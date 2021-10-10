const express = require('express');
const bodyParser = require('body-parser');
 
const authMiddleware = require('./authMiddleware');
const generateToken = require('./generateToken');
const { validateName, validateAge, validateTalk, validateWatchedAt,
  validateRate, createTalks, editTalker, deleteTalker, getAllTalker, getTalkerById,
  getTalkerByQueryString,
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

app.get('/talker/search', validateToken, getTalkerByQueryString);

app.get('/talker', getAllTalker);

app.get('/talker/:id', getTalkerById);

app.post('/login', authMiddleware, (_req, res) => {
  const keyToken = generateToken();
  return res.status(200).json({ token: keyToken });
});

app.post('/talker', validateToken,
  validateName, validateAge, validateTalk, validateRate, validateWatchedAt, createTalks);

app.put('/talker/:id', validateToken,
validateName, validateAge, validateTalk, validateRate, validateWatchedAt, editTalker);

app.delete('/talker/:id', validateToken, deleteTalker);
