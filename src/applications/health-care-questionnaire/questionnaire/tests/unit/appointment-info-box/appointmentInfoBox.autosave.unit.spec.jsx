import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import VeteranInformationDisplay from '../../../components/veteran-info/VeteranInformationDisplay';

describe('health care questionnaire - VeteranInformationDisplay', () => {
  it('Appointment Info Box -- saving stuff', () => {
    const onChange = sinon.spy();
    const veteranInfo = {
      gender: 'M',
      dateOfBirth: '12/12/1988',
      fullName: 'Simba',
      phoneNumbers: [],
      addresses: {},
    };
    const data = {};

    const appointmentDetails = mount(
      <VeteranInformationDisplay
        veteranInfo={veteranInfo}
        data={data}
        setFormData={onChange}
      />,
    );
    expect(onChange.called).to.be.true;
    appointmentDetails.unmount();
  });
});
