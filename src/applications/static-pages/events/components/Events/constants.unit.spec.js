import { expect } from 'chai';
import { perPage } from './constants';

describe('Events constants.js', () => {
  it('perPage', () => {
    expect(perPage).to.equal(10);
  });
});
