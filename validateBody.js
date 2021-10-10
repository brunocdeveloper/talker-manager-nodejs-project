const fs = require('fs').promises;

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
};

const editTalker = async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;

  const talkers = JSON.parse(await fs.readFile('./talker.json'));

  const talkerIndex = talkers.findIndex((t) => t.id === Number(id));

  talkers[talkerIndex] = { ...talkers[talkerIndex], name, age, talk };

  await fs.writeFile('./talker.json', JSON.stringify(talkers));

  res.status(200).json(talkers[talkerIndex]);
};

/* const allValidations = async () => {
  validateName();
  validateAge();
  validateTalk();
  validateWatchedAt();
  validateRate();
};  */

module.exports = {
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  createTalks,
  editTalker,
};