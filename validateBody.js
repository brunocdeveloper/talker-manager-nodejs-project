const fs = require('fs').promises;

const promiseToRead = require('./promiseToRead.js');

const PATH = './talker.json';
const HTTP_OK_STATUS = 200;

const getAllTalker = async (_req, res) => {
  const talkers = JSON.parse(await promiseToRead(fs.readFile('./talker.json', 'utf-8')));
  if (talkers.length < 1) return res.status(200).json([]);
  return res.status(200).json(talkers);
};

const getTalkerById = async (req, res) => {
  const { id } = req.params;
  const talkers = JSON.parse(await promiseToRead(fs.readFile('./talker.json', 'utf-8')));

  const result = talkers.find((person) => person.id === Number(id));

  if (!result) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(HTTP_OK_STATUS).json(result);
};

const validateName = (req, res, next) => {
  const { name } = req.body;

  if (!name || name === '') {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }

  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;

  if (!age || age === '') return res.status(400).json({ message: 'O campo "age" é obrigatório' });

  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
 
  if (!talk || !talk.watchedAt || (!talk.rate && talk.rate !== 0)) {
    return res.status(400).json(
      {
        message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
      },
    );
  }

  next();
};

const validateWatchedAt = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const validator = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/;

  if (!validator.test(watchedAt)) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }

  next();
};

const validateRate = (req, res, next) => {
  const { talk: { rate } } = req.body;

  if ((Number(rate) < 1 || Number(rate) > 5)) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    });
  }

  next();
};

const createTalks = async (req, res) => {
  const { name, age, talk } = req.body;
  
  const talkers = JSON.parse(await fs.readFile(PATH));

  talkers.push({
    id: talkers.length + 1,
    name,
    age,
    talk,
  });

  await fs.writeFile(PATH, JSON.stringify(talkers));
  return res.status(201).json({
    id: talkers.length,
    name,
    age,
    talk,
  });
};

const editTalker = async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;

  const talkers = JSON.parse(await fs.readFile(PATH));

  const talkerIndex = talkers.findIndex((t) => t.id === Number(id));

  talkers[talkerIndex] = { ...talkers[talkerIndex], name, age, talk };

  await fs.writeFile(PATH, JSON.stringify(talkers));

  res.status(200).json(talkers[talkerIndex]);
};

const deleteTalker = async (req, res) => {
  const { id } = req.params;

  const talkers = JSON.parse(await fs.readFile(PATH));

  const talkerIndex = talkers.findIndex((t) => t.id === Number(id));

  talkers.splice(talkerIndex, 1);

  await fs.writeFile(PATH, JSON.stringify(talkers));

  return res.status(200).json({ message: 'Pessoa palestrante deletada com sucesso' });
};

const getTalkerByQueryString = async (req, res) => {
  const { q } = req.query;

  const talkers = JSON.parse(await fs.readFile(PATH));

  if (!q || q === '') return res.status(200).json(talkers);

  const talkerFilter = talkers.filter((t) => t.name.includes(q));

  return res.status(200).json(talkerFilter);
};

module.exports = {
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  createTalks,
  editTalker,
  deleteTalker,
  getAllTalker,
  getTalkerById,
  getTalkerByQueryString,
};