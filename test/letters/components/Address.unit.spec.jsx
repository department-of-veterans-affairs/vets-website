import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { getFormDOM } from '../../util/schemaform-utils';
import Address from '../../../src/js/letters/components/Address.jsx';

const defaultProps = {
  address: {
    type: 'DOMESTIC',
    addressOne: '2746 Main St',
    addressTwo: 'Apt 2',
    city: 'Town',
    stateCode: 'MA',
    countryName: 'US',
    zipCode: '02138'
  },
  errorMessages: {},
};

describe('<Address>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Address {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should change the city and state fields for a military address', () => {
    const militaryFields = {
      type: 'MILITARY',
      city: 'APO',
      stateCode: 'AE'
    };
    const props = {
      ...defaultProps,
      address: {
        ...defaultProps.address, ...militaryFields
      }
    };

    const component = ReactTestUtils.renderIntoDocument(<Address {...props}/>);
    const form = getFormDOM(component);

    expect(form.getElement('input[name="city"]').value).to.contain('APO');
    expect(form.getElement('select[name="state"]').value).to.contain('AE');
  });

  it('should call onInput with correct args when user types in input', () => {
    const onInputSpy = sinon.spy();
    const props = { ...defaultProps, onInput: onInputSpy };
    const component = ReactTestUtils.renderIntoDocument(<Address {...props}/>);
    const form = getFormDOM(component);

    const addressLine1 = '321 Niam';
    // NOTE: All address lines are currently named "address", but querySelector just picks the first one
    form.fillData('input[name="address"]', addressLine1);
    expect(onInputSpy.calledWith('addressOne', addressLine1)).to.be.true;
  });
  // TODO: Add a test for rendering error messages
});
