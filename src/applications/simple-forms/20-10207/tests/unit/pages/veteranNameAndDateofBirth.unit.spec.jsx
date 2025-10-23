import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { PREPARER_TYPES } from '../../../config/constants';
import * as helpers from '../../../helpers';
import veteranNameAndDateofBirth from '../../../pages/veteranNameAndDateofBirth';

describe('veteranNameAndDateofBirth', () => {
  it('calls getNameAndDobPageTitle and getNameAndDobPageDescription with formData when titleUI is called', () => {
    const formDataVet = {
      preparerType: PREPARER_TYPES.VETERAN,
    };
    const stubTitle = sinon.stub(helpers, 'getNameAndDobPageTitle');
    const stubDescription = sinon.stub(helpers, 'getNameAndDobPageDescription');

    // Render the component with the test data
    const TitleComponent = veteranNameAndDateofBirth.uiSchema['ui:title'];
    const wrapper = mount(<TitleComponent formData={formDataVet} />);

    // Check if the stubs were called with the correct data
    expect(stubTitle.calledWith(formDataVet)).to.be.true;
    expect(stubDescription.calledWith(formDataVet)).to.be.true;

    // Unmount the component
    wrapper.unmount();

    // Restore the original functions
    stubTitle.restore();
    stubDescription.restore();
  });
});
