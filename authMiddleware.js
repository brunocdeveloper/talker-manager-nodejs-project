function validateEmail(email) {
  const validation = /\S+@\S+\.\S+/;
  return validation.test(email);
}

const authMiddleware = (req, res, next) => {
  const { email, password } = req.body;
  const validEmail = validateEmail(email);

  if (!email) res.status(400).send({ message: 'O campo "email" é obrigatório' }); 

  if (!validEmail) {
    res.status(400).send({ message: 'O "email" deve ter o formato "email@email.com"' });
  }

  if (!password) {
    res.status(400).send({ message: 'O campo "password" é obrigatório' });
  }

  if (password.length < 6) {
    res.status(400).send({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  next();
};

module.exports = authMiddleware;
