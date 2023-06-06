const get = require('./get');
const post = require('./post');

module.exports = {
  get: { ...get },
  post: { ...post },
};
