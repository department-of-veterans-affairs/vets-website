import { expect } from 'chai';

// This is a trivial test that shows the CI system is sane.
describe('CI Sanity', () => {
  it('Trivial reflexive equality of true should pass.', () => {
    expect(true).to.be.true;
  });
});
