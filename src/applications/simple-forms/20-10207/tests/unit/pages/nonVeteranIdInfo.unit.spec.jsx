import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { PREPARER_TYPES } from '../../../config/constants';
import * as helpers from '../../../helpers';
import nonVeteranIdInfo from '../../../pages/nonVeteranIdInfo';

describe('nonVeteranIdInfo', () => {
  it('calls getIdentityInfoPageTitle with formData when titleUI is called', () => {
    const formDataNonVet = {
      preparerType: PREPARER_TYPES.NON_VETERAN,
    };
    const stub = sinon.stub(helpers, 'getIdentityInfoPageTitle');

    // Render the component with the test data
    const TitleComponent = nonVeteranIdInfo.uiSchema['ui:title'];
    const wrapper = mount(<TitleComponent formData={formDataNonVet} />);

    // Check if the stub was called with the correct data
    expect(stub.calledWith(formDataNonVet)).to.be.true;

    // Unmount the component
    wrapper.unmount();

    // Restore the original function
    stub.restore();
  });
});
