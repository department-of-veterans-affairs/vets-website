const post = require('./post');
const patch = require('./patch');

module.exports = {
  post: { ...post },
  patch: { ...patch },
};
