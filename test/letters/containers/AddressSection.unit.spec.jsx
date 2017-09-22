import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';
import sinon from 'sinon';

import { getFormDOM } from '../../util/schemaform-utils';
import { AddressSection } from '../../../src/js/letters/containers/AddressSection';

const saveSpy = sinon.spy();

const defaultProps = {
  savedAddress: {
    addressOne: '2476 Main Street',
    city: 'Reston',
    country: 'US',
    state: 'VA',
    zipCode: '12345'
  },
  canUpdate: true,
  saveAddress: saveSpy,
};

describe('<AddressSection>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<AddressSection { ...defaultProps }/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should display an address if one is provided in props', () => {
    const tree = SkinDeep.shallowRender(<AddressSection { ...defaultProps }/>);
    const addressContent = tree.dive(['AddressContent']);
    expect(addressContent).to.exist;
  });

  it('should display an error message if address is empty', () => {
    const newProps = { ...defaultProps, savedAddress: {} };
    const tree = SkinDeep.shallowRender(<AddressSection { ...newProps }/>);
    const invalidAddress = tree.dive(['InvalidAddress']);
    expect(invalidAddress).to.exist;
    
  });

  // TO-DO:
  //  1. Move following tests into new testfile for new component
  //  2. Test other new components
  //  3. Test new functionality of AddressSection (ie. conditional rendering);

  it('should format 1 address line', () => {
    const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);
    expect(tree.subTree('.address-block').text()).to.be.false;
  });

  it('should format address 2 address lines', () => {
    const props = _.merge({}, defaultProps, { address: { addressTwo: 'ste #12' } });
    const tree = SkinDeep.shallowRender(<AddressSection {...props}/>);
    expect(tree.subTree('.step-content').text()).to.contain('2476 main street, ste #12');
  });

  it('should format address 3 address lines', () => {
    const props = _.merge({}, defaultProps, {
      address: {
        addressTwo: 'ste #12',
        addressThree: 'west'
      }
    });
    const tree = SkinDeep.shallowRender(<AddressSection {...props}/>);
    expect(tree.subTree('.step-content').text()).to.contain('2476 main street, ste #12 west');
  });

  it('should not render an edit button if user not allowed to edit address', () => {
    const cannotEditProps = { ...defaultProps, canUpdate: false };
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...cannotEditProps}/>);
    expect(() => ReactTestUtils.findRenderedDOMComponentWithTag(component, 'button')).to.throw();
  });

  it('should render an edit button if user is allowed to edit address', () => {
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const editButton = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'button');
    expect(editButton).to.not.be.empty;
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
    expect(saveSpy.calledWith(defaultProps.address)).to.be.true;
  });
});
