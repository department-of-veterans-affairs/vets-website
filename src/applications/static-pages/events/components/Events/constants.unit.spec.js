// Node modules.
import { expect } from 'chai';
// Relative imports.
import { perPage } from './constants';

describe('Events constants.js', () => {
  it('perPage', () => {
    // Assertions.
    expect(perPage).to.equal(10);
  });
});
