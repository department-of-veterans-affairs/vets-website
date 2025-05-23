import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import SSNWidget from '../../../src/js/review/SSNWidget';

describe('Schemaform review <SSNWidget>', () => {
  it('should format ssn', () => {
    const tree = SkinDeep.shallowRender(<SSNWidget value="123456789" />);

    expect(tree.text()).to.equal('●●●-●●-6789');
  });
  it('should render empty value', () => {
    const tree = SkinDeep.shallowRender(<SSNWidget />);

    // The only time it will equal '' is when initializing it with value=''
    expect(tree.text()).to.equal('');
  });
});
