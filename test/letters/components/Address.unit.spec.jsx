import React from 'react';
// import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
// import _ from 'lodash';

import Address from '../../../src/js/letters/components/Address.jsx';

const defaultProps = {
  value: {
    addressOne: '2746 Main St',
    addressTwo: 'Apt 2',
    city: 'Town',
    state: 'MA',
    country: 'US',
    zipCode: '02138'
  }
};

describe('<Address>', () => {
  it.only('should render', () => {
    const tree = SkinDeep.shallowRender(<Address {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});
