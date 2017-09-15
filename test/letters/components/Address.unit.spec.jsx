import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';

import Address from '../../../src/js/letters/components/Address.jsx';

const defaultProps = {
  value: {
    type: 'DOMESTIC',
    addressOne: '2746 Main St',
    addressTwo: 'Apt 2',
    city: 'Town',
    state: 'MA',
    country: 'US',
    zipCode: '02138'
  }
};

describe('<Address>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Address {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should change the city and state fields for a military address', () => {
    const props = _.merge({}, defaultProps, {
      value: {
        type: 'MILITARY',
        militaryPostOfficeTypeCode: 'APO',
        militaryStateCode: 'AE'
      }
    });

    const component = ReactTestUtils.renderIntoDocument(<Address {...props}/>);
    const cityInput = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'input')[3];
    const stateInput = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')[1];

    expect(cityInput.value).to.contain('APO');
    expect(stateInput.value).to.contain('AE');
  });
});
