import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { getFormDOM } from '../../util/schemaform-utils';
import { AddressSection } from '../../../src/js/letters/containers/AddressSection';
import { ADDRESS_TYPES } from '../../../src/js/letters/utils/constants';

const saveSpy = sinon.spy();

const defaultProps = {
  savedAddress: {
    type: ADDRESS_TYPES.domestic,
    addressOne: '2476 Main Street',
    city: 'Reston',
    country: 'US',
    state: 'VA',
    zipCode: '12345'
  },
  canUpdate: true,
  saveAddress: saveSpy,
  countries: [],
  countriesAvailable: true,
  states: [],
  statesAvailable: true
};

describe('<AddressSection>', () => {
  // we expect a render with default props to show the AddressContent component
  it('should display an address if one is provided in props', () => {
    const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);
    const addressContent = tree.dive(['AddressContent']);
    const contentHeader = addressContent.subTree('p').text();

    expect(contentHeader).to.contain('Downloaded documents will list your address as:');
  });

  it('should display an error message if address is empty', () => {
    const newProps = { ...defaultProps, savedAddress: {} };
    const tree = SkinDeep.shallowRender(<AddressSection {...newProps}/>);
    const invalidAddress = tree.subTree('p').text();

    expect(invalidAddress).to.contain('We’re encountering an error with your');
  });

  it('should format 1 address line', () => {
    const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);
    const addressBlock = tree.dive(['AddressContent', 'AddressBlock']);
    const addressBlockText = addressBlock.subTree('.address-block', 'div.letters-address').text();
    // NOTE: have to pass in uncapitalized addresses to assert against because shallowRender apparently strips caps...
    expect(addressBlockText).to.contain('2476 main street');
  });

  it('should format address 2 address lines', () => {
    const props = {
      ...defaultProps,
      savedAddress: {
        ...defaultProps.savedAddress,
        addressTwo: 'ste #12'
      }
    };

    const tree = SkinDeep.shallowRender(<AddressSection {...props}/>);
    const addressBlock = tree.dive(['AddressContent', 'AddressBlock']);
    const addressBlockText = addressBlock.subTree('.address-block', 'div.letters-address').text();

    expect(addressBlockText).to.contain('2476 main street, ste #12');
  });

  it('should format address 3 address lines', () => {
    const props = {
      ...defaultProps,
      savedAddress: {
        ...defaultProps.savedAddress,
        addressTwo: 'ste #12',
        addressThree: 'west'
      }
    };

    const tree = SkinDeep.shallowRender(<AddressSection {...props}/>);
    const addressBlock = tree.dive(['AddressContent', 'AddressBlock']);
    const addressBlockText = addressBlock.subTree('.address-block', 'div.letters-address').text();
    expect(addressBlockText).to.contain('2476 main street, ste #12 west');
  });

  it('should render an edit button if user is allowed to edit address', () => {
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const editButton = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'button');
    expect(editButton).to.not.be.empty;
  });

  it('should not render an edit button if user not allowed to edit address', () => {
    const cannotEditProps = { ...defaultProps, canUpdate: false };
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...cannotEditProps}/>);
    expect(() => ReactTestUtils.findRenderedDOMComponentWithTag(component, 'button')).to.throw();
  });

  it('should expand address fields when Edit button is clicked', () => {
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const tree = getFormDOM(component);

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;

    tree.click('button.usa-button-outline');

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.not.be.empty;
  });

  it('should collapse address fields when Update button is clicked', () => {
    saveSpy.reset();

    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const tree = getFormDOM(component);

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;

    tree.click('button.usa-button-outline');

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.not.be.empty;

    tree.click('button.usa-button-primary');

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;
    expect(saveSpy.calledWith(component.state.editableAddress)).to.be.true;
  });

  it('should collapse address fields when Cancel button is clicked', () => {
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const tree = getFormDOM(component);

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;

    tree.click('button.usa-button-outline');

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.not.be.empty;

    tree.click('button.usa-button-outline');

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;
  });

});
