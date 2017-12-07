const mock = require('../../../test/e2e/mock-helpers');
const util = require('util');
const events = require('events');

function MockData() {
  events.EventEmitter.call(this);
}

util.inherits(MockData, events.EventEmitter);

/**
 * Calls mock data api, in line with test calls
 */
MockData.prototype.command = function mockDataCommand(data, token = null) {
  const self = this;
  mock(token, data)
    .then(() => {
      self.emit('complete');
    })
    .catch(() => {
      self.emit('complete');
    });

  return this;
};

module.exports = MockData;
