import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import isBrandConsolidationEnabled from '../feature-flag';

function SharedComponent() {
  if (isBrandConsolidationEnabled()) return <h1>VA.gov</h1>;
  return <h1>Vets.gov</h1>;
}

describe('brand-consolidation/feature-flag', () => {
  let _featureFlagRef = null;

  before(() => {
    _featureFlagRef = process.env.BRAND_CONSOLIDATION_ENABLED;
  });

  after(() => {
    process.env.BRAND_CONSOLIDATION_ENABLED = _featureFlagRef;
  });

  it('renders Vets.gov when the feature-flag is false', () => {
    delete process.env.BRAND_CONSOLIDATION_ENABLED;

    const component = enzyme.shallow(<SharedComponent/>);
    expect(component.text()).to.be.equal('Vets.gov');
  });

  it('renders VA.gov when the feature-flag is true', () => {
    process.env.BRAND_CONSOLIDATION_ENABLED = true;

    const component = enzyme.shallow(<SharedComponent/>);
    expect(component.text()).to.be.equal('VA.gov');
  });

});
