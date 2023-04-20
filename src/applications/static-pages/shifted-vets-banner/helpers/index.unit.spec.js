// Node modules.
import { expect } from 'chai';
// Relative imports.
import { hideDefaultBanner } from '.';

describe('hideDefaultBanner', () => {
  it('returns what we expect with no arguments', () => {
    expect(hideDefaultBanner()).to.equal(undefined);
  });
});
