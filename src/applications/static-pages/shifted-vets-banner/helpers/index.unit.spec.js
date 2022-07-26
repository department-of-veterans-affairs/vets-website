// Node modules.
import { expect } from 'chai';
// Relative imports.
import { hideDefaultBanner, showDefaultBanner } from '.';

describe('hideDefaultBanner', () => {
  it('returns what we expect with no arguments', () => {
    expect(hideDefaultBanner()).to.equal(undefined);
  });
});

describe('showDefaultBanner', () => {
  it('returns what we expect with no arguments', () => {
    expect(showDefaultBanner()).to.equal(undefined);
  });
});
