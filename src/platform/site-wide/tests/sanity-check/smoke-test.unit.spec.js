import { expect } from '../../../testing/unit/helpers.js';

describe('Unittest sanity test', () => {
  test('Trivial reflexive equality of true should pass.', () => {
    expect(true).to.be.true;
  });
});
