import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import AddressSection from '../../../src/js/va-letters/components/AddressSection.jsx';

const defaultProps = {
  destination: {
    addressLine1: '2476 Main Street',
    addressLine2: 'Ste #12',
    addressLine3: 'West',
    city: 'Reston',
    country: 'US',
    foreignCode: '865',
    fullName: 'Mark Webb',
    state: 'VA',
    zipCode: '12345'
  }
};

describe('<AddressSection>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should format address', () => {
    const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(tree.subTree('.step-content').text()).to.contain('2476 Main Street, Ste #12 West');
    expect(vdom).to.exist;
  });
});
