import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { PREPARER_TYPES } from '../../../config/constants';
import * as helpers from '../../../helpers';
import veteranIdInfo from '../../../pages/veteranIdInfo';

describe('veteranIdInfo', () => {
  it('calls getVeteranIdentityInfoPageTitle with formData when titleUI is called', () => {
    const formDataVet = {
      preparerType: PREPARER_TYPES.VETERAN,
    };
    const stub = sinon.stub(helpers, 'getVeteranIdentityInfoPageTitle');

    // Render the component with the test data
    const TitleComponent = veteranIdInfo.uiSchema['ui:title'];
    const wrapper = mount(<TitleComponent formData={formDataVet} />);

    // Check if the stub was called with the correct data
    expect(stub.calledWith(formDataVet)).to.be.true;

    // Unmount the component
    wrapper.unmount();

    // Restore the original function
    stub.restore();
  });
});
