import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import isBrandConsolidationEnabled from '../feature-flag';

function SharedComponent() {
  if (isBrandConsolidationEnabled()) return <h1>VA.gov</h1>;
  return <h1>Vets.gov</h1>;
}

describe('brand-consolidation/feature-flag', () => {
  let windowRef = null;

  before(() => {
    windowRef = global.window;
  });

  after(() => {
    global.window = windowRef;
  });

  it('renders Vets.gov when the feature-flag is false', () => {
    global.window = {
      settings: {
        brandConsolidation: {
          enabled: false
        }
      }
    };
    const component = enzyme.shallow(<SharedComponent/>);
    expect(component.text()).to.be.equal('Vets.gov');
  });

  it('renders VA.gov when the feature-flag is true', () => {
    global.window = {
      settings: {
        brandConsolidation: {
          enabled: true
        }
      }
    };
    const component = enzyme.shallow(<SharedComponent/>);
    expect(component.text()).to.be.equal('VA.gov');
  });
});
