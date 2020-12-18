import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import VeteranInformationDisplay from '../../../components/veteran-info/VeteranInformationDisplay';

describe('health care questionnaire - VeteranInformationDisplay', () => {
  it('Appointment Info Box -- saving stuff', () => {
    const setFormData = sinon.spy();
    const saveForm = sinon.spy();
    const veteranInfo = {
      gender: 'M',
      dateOfBirth: '12/12/1988',
      fullName: 'Simba',
      phoneNumbers: [],
      addresses: {},
    };
    const data = {};
    const formId = 'my cool id';
    const version = '0';

    const appointmentDetails = mount(
      <VeteranInformationDisplay
        veteranInfo={veteranInfo}
        data={data}
        formId={formId}
        version={version}
        setFormData={setFormData}
        saveForm={saveForm}
      />,
    );
    expect(setFormData.called).to.be.true;
    expect(saveForm.called).to.be.true;
    appointmentDetails.unmount();
  });
});
