import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';

import { AddressSection } from '../../../src/js/letters/containers/AddressSection.jsx';

const defaultProps = {
  destination: {
    addressLine1: '2476 Main Street',
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

  it('should format 1 address line', () => {
    const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);
    expect(tree.subTree('.step-content').text()).to.contain('2476 main street');
  });

  it('should format address 2 address lines', () => {
    const props = _.merge({}, defaultProps, { destination: { addressLine2: 'ste #12' } });
    const tree = SkinDeep.shallowRender(<AddressSection {...props}/>);
    expect(tree.subTree('.step-content').text()).to.contain('2476 main street, ste #12');
  });

  it('should format address 3 address lines', () => {
    const props = _.merge({}, defaultProps, {
      destination: {
        addressLine2: 'ste #12',
        addressLine3: 'west'
      }
    });
    const tree = SkinDeep.shallowRender(<AddressSection {...props}/>);
    expect(tree.subTree('.step-content').text()).to.contain('2476 main street, ste #12 west');
  });
});
