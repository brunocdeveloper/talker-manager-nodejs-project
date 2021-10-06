const genericPromise = (promises) => promises
  .then((content) => content)
  .catch((error) => error);

module.exports = genericPromise;