import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
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

  it('should expand address fields when Edit button is clicked', () => {
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const editButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'button')[0];
    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;

    ReactTestUtils.Simulate.click(editButton);

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.not.be.empty;
  });

  it('should collase address fields when Update button is clicked', () => {
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const editButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'button')[0];
    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;

    ReactTestUtils.Simulate.click(editButton);

    const updateButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'button')[0];
    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.not.be.empty;

    ReactTestUtils.Simulate.click(updateButton);

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;
  });
});
