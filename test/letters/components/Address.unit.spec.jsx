import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';
import sinon from 'sinon';

import { getFormDOM } from '../../util/schemaform-utils';
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
        city: 'APO',
        state: 'AE'
      }
    });

    const component = ReactTestUtils.renderIntoDocument(<Address {...props}/>);
    const form = getFormDOM(component);

    expect(form.getElement('input[name="city"]').value).to.contain('APO');
    expect(form.getElement('select[name="state"]').value).to.contain('AE');
  });

  it('should update the redux store when fields are updated', () => {
    const updateSpy = sinon.spy();
    const props = _.merge({}, defaultProps, { onUserInput: updateSpy });
    const component = ReactTestUtils.renderIntoDocument(<Address {...props}/>);
    const form = getFormDOM(component);

    // NOTE: All address lines are currently named "address", but querySelector just picks the first one
    form.fillData('input[name="address"]', '321 Niam');

    // Match the first param of the first call with what we changed
    expect(updateSpy.args[0][0].addressOne).to.equal('321 Niam');
  });
});
