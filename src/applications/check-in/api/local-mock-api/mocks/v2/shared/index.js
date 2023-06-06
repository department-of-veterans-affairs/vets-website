const get = require('./get');
const post = require('./post');
const patch = require('./patch');

module.exports = {
  get: { ...get },
  post: { ...post },
  patch: { ...patch },
};
