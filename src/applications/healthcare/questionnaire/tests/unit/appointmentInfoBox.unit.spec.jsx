import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AppointmentInfoBox from '../../components/AppointmentInfoBox';

import { createFakeStore } from './utils/createFakeStores';

describe('healthcare-questionnaire - AppointmentInfoBox', () => {
  it('Appointment Info Box -- details that are always shown -- Full name; date of birth;', () => {
    const fakeStore = createFakeStore();
    const appointmentDetails = mount(<AppointmentInfoBox store={fakeStore} />);
    expect(
      appointmentDetails.find('[data-test-id="fullName"]').text(),
    ).to.equal('CALVIN C FLETCHER');
    expect(
      appointmentDetails.find('[data-test-id="dateOfBirth"]').text(),
    ).to.equal('December 19, 1924');

    appointmentDetails.unmount();
  });
  it('Appointment Info Box -- dynamic details -- gender', () => {
    const noGender = createFakeStore('');
    const hasGender = createFakeStore('M');
    const appointmentNoGender = mount(<AppointmentInfoBox store={noGender} />);
    expect(appointmentNoGender.exists('[data-test-id="gender"]')).to.equal(
      false,
    );
    appointmentNoGender.unmount();

    const appointmentHasGender = mount(
      <AppointmentInfoBox store={hasGender} />,
    );
    expect(
      appointmentHasGender.find('[data-test-id="gender"]').text(),
    ).to.equal('Male');
    appointmentHasGender.unmount();
  });
  it('Appointment Info Box -- dynamic details -- mailing address', () => {
    const hasAddress = createFakeStore();
    const appointmentInfoBox = mount(<AppointmentInfoBox store={hasAddress} />);
    expect(
      appointmentInfoBox.find('[data-test-id="mailingAddress"]').text(),
    ).to.contains('1493 Martin Luther King Rd Apt 1');
    appointmentInfoBox.unmount();

    const noAddress = createFakeStore(null, false);
    const appointmentInfoBoxNoAddress = mount(
      <AppointmentInfoBox store={noAddress} />,
    );
    expect(
      appointmentInfoBoxNoAddress.exists('[data-test-id="mailingAddress"]'),
    ).to.equal(false);
    appointmentInfoBoxNoAddress.unmount();
  });
  it('Appointment Info Box -- dynamic details -- residential address', () => {
    const hasAddress = createFakeStore();
    const appointmentInfoBox = mount(<AppointmentInfoBox store={hasAddress} />);
    expect(
      appointmentInfoBox.find('[data-test-id="residentialAddress"]').text(),
    ).to.contains('PSC 808 Box 37');
    appointmentInfoBox.unmount();

    const noAddress = createFakeStore(null, false, false);
    const appointmentInfoBoxNoAddress = mount(
      <AppointmentInfoBox store={noAddress} />,
    );
    expect(
      appointmentInfoBoxNoAddress.exists('[data-test-id="mailingAddress"]'),
    ).to.equal(false);
    appointmentInfoBoxNoAddress.unmount();
  });
  it('Appointment Info Box -- dynamic details --  phone numbers', () => {
    // all phones
    const hasAllPhones = createFakeStore();
    const appointmentInfoBoxAllPhones = mount(
      <AppointmentInfoBox store={hasAllPhones} />,
    );
    expect(
      appointmentInfoBoxAllPhones.find('[data-test-id="phoneNumber"]').length,
    ).to.equal(4);
    appointmentInfoBoxAllPhones.unmount();

    // no phones
    const hasNoPhones = createFakeStore(null, false, false, {});
    const appointmentInfoBoxNoPhones = mount(
      <AppointmentInfoBox store={hasNoPhones} />,
    );
    expect(
      appointmentInfoBoxNoPhones.find('[data-test-id="phoneNumber"]').length,
    ).to.equal(0);
    appointmentInfoBoxNoPhones.unmount();

    // Home and mobile only
    const hasHomeAndMobile = createFakeStore(null, false, false, {
      hasHome: true,
      hasMobile: true,
    });
    const appointmentInfoBoxHomeAndMobilePhones = mount(
      <AppointmentInfoBox store={hasHomeAndMobile} />,
    );
    expect(
      appointmentInfoBoxHomeAndMobilePhones.find('[data-test-id="phoneNumber"]')
        .length,
    ).to.equal(2);
    appointmentInfoBoxHomeAndMobilePhones.unmount();
  });
});
