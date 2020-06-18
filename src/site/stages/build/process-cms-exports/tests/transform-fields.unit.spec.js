const { expect } = require('chai');
const { serialize } = require('../transform-fields');

describe('serialize', () => {
  it('should normalize objects', () => {
    expect(serialize({ foo: 'foo', bar: 'bar' })).to.deep.equal(
      serialize({ bar: 'bar', foo: 'foo' }),
    );
  });

  it('should serialize variables', () => {
    expect(serialize({ foo: 'foo' })).to.be.a('string');
  });
});
