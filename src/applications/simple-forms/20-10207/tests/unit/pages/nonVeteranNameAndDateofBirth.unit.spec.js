import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { PREPARER_TYPES } from '../../../config/constants';
import * as helpers from '../../../helpers';
import nonVeteranNameAndDateofBirth from '../../../pages/nonVeteranNameAndDateOfBirth';

describe('nonVeteranNameAndDateofBirth', () => {
  it('calls getNameAndDobPageTitle and getNameAndDobPageDescription with formData when titleUI is called', () => {
    const formDataNonVet = {
      preparerType: PREPARER_TYPES.NON_VETERAN,
    };
    const stubTitle = sinon.stub(helpers, 'getNameAndDobPageTitle');
    const stubDescription = sinon.stub(helpers, 'getNameAndDobPageDescription');

    // Render the component with the test data
    const TitleComponent = nonVeteranNameAndDateofBirth.uiSchema['ui:title'];
    const wrapper = mount(<TitleComponent formData={formDataNonVet} />);

    // Check if the stubs were called with the correct data
    expect(stubTitle.calledWith(formDataNonVet)).to.be.true;
    expect(stubDescription.calledWith(formDataNonVet)).to.be.true;

    // Unmount the component
    wrapper.unmount();

    // Restore the original functions
    stubTitle.restore();
    stubDescription.restore();
  });
});
