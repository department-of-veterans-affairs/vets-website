import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import isBrandConsolidation from '../feature-flag';

function SharedComponent() {
  if (isBrandConsolidation()) return <h1>VA.gov</h1>;
  return <h1>Vets.gov</h1>;
}

describe('brand-consolidation/feature-flag', () => {
  let _featureFlagRef = null;

  before(() => {
    _featureFlagRef = process.env.IS_BRAND_CONSOLIDATED_BUILD;
  });

  after(() => {
    process.env.IS_BRAND_CONSOLIDATED_BUILD = _featureFlagRef;
  });

  it('renders Vets.gov when the feature-flag is false', () => {
    delete process.env.IS_BRAND_CONSOLIDATED_BUILD;

    const component = enzyme.shallow(<SharedComponent/>);
    expect(component.text()).to.be.equal('Vets.gov');
  });

  it('renders VA.gov when the feature-flag is true', () => {
    process.env.IS_BRAND_CONSOLIDATED_BUILD = true;

    const component = enzyme.shallow(<SharedComponent/>);
    expect(component.text()).to.be.equal('VA.gov');
  });

});
