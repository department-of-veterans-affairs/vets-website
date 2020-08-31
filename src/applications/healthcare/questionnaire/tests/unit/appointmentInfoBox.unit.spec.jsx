import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AppointmentInfoBox from '../../components/AppointmentInfoBox';

import { createFakeStore } from './utils/createFakeStores';

describe('healthcare-questionnaire - AppointmentInfoBox', () => {
  it('Appointment Info Box -- details that are always shown -- Full name; date of birth;', () => {
    const fakeStore = createFakeStore();
    const appointmentDetails = mount(<AppointmentInfoBox store={fakeStore} />);
    expect(appointmentDetails.find('[data-testId="fullName"]').text()).to.equal(
      'CALVIN C FLETCHER',
    );
    expect(
      appointmentDetails.find('[data-testId="dateOfBirth"]').text(),
    ).to.equal('December 19, 1924');

    appointmentDetails.unmount();
  });
  it('Appointment Info Box -- dynamic details -- gender', () => {
    const noGender = createFakeStore('');
    const hasGender = createFakeStore('M');
    const appointmentNoGender = mount(<AppointmentInfoBox store={noGender} />);
    expect(appointmentNoGender.exists('[data-testId="gender"]')).to.equal(
      false,
    );
    appointmentNoGender.unmount();

    const appointmentHasGender = mount(
      <AppointmentInfoBox store={hasGender} />,
    );
    expect(appointmentHasGender.find('[data-testId="gender"]').text()).to.equal(
      'Male',
    );
    appointmentHasGender.unmount();
  });
  it('Appointment Info Box -- dynamic details -- addresses', () => {});
  it('Appointment Info Box -- dynamic details --  phone numbers', () => {});
});
