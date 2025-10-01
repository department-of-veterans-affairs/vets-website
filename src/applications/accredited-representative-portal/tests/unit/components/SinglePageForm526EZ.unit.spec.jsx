import { expect } from 'chai';

// Smoke test for SinglePageForm526EZ module exports. This ensures refactors
// do not accidentally remove or rename the primary exports while avoiding
// heavier DOM/web component setup that caused earlier failures.

describe('SinglePageForm526EZ module exports (smoke)', () => {
  let mod;
  before(() => {
    // eslint-disable-next-line global-require
    mod = require('../../../components/Forms/SinglePageForm526EZ');
  });

  it('exports SinglePageForm526EZUnconnected', () => {
    expect(mod.SinglePageForm526EZUnconnected).to.be.a('function');
  });

  it('exports SinglePageForm526EZBare', () => {
    expect(mod.SinglePageForm526EZBare).to.be.a('function');
  });

  it('has a default connected export', () => {
    expect(mod.default).to.exist;
  });
});
