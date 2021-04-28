import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AppointmentInfoBox from '../../../components/veteran-info/AppointmentInfoBox';

import { createFakeUserStore } from '../utils/createFakeStores';

describe('health care questionnaire - AppointmentInfoBox', () => {
  it('Appointment Info Box -- details that are always shown -- Full name; date of birth;', () => {
    const fakeStore = createFakeUserStore();
    const appointmentDetails = mount(
      <AppointmentInfoBox store={fakeStore} onChange={() => {}} />,
    );
    expect(appointmentDetails.find('[data-testid="fullName"]').text()).to.equal(
      'Calvin C Fletcher',
    );
    expect(
      appointmentDetails.find('[data-testid="dateOfBirth"]').text(),
    ).to.equal('December 19, 1924');

    appointmentDetails.unmount();
  });
  it('Appointment Info Box -- dynamic details -- gender -- gender unknown', () => {
    const noGender = createFakeUserStore('');
    const appointmentNoGender = mount(
      <AppointmentInfoBox store={noGender} onChange={() => {}} />,
    );
    expect(appointmentNoGender.exists('[data-testid="gender"]')).to.equal(
      false,
    );
    appointmentNoGender.unmount();
  });
  it('Appointment Info Box -- dynamic details -- gender -- has gender', () => {
    const hasGender = createFakeUserStore('M');
    const appointmentHasGender = mount(
      <AppointmentInfoBox store={hasGender} onChange={() => {}} />,
    );
    expect(appointmentHasGender.find('[data-testid="gender"]').text()).to.equal(
      'Male',
    );
    appointmentHasGender.unmount();
  });
  it('Appointment Info Box -- dynamic details -- mailing address -- no address', () => {
    const noAddress = createFakeUserStore(null, false);
    const appointmentInfoBoxNoAddress = mount(
      <AppointmentInfoBox store={noAddress} onChange={() => {}} />,
    );
    expect(
      appointmentInfoBoxNoAddress.exists('[data-testid="mailingAddress"]'),
    ).to.equal(false);
    appointmentInfoBoxNoAddress.unmount();
  });
  it('Appointment Info Box -- dynamic details -- mailing address -- has address', () => {
    const hasAddress = createFakeUserStore();
    const appointmentInfoBox = mount(
      <AppointmentInfoBox store={hasAddress} onChange={() => {}} />,
    );
    expect(
      appointmentInfoBox.find('[data-testid="mailingAddress"]').text(),
    ).to.contains('1493 Martin Luther King Rd Apt 1');
    appointmentInfoBox.unmount();
  });
  it('Appointment Info Box -- dynamic details -- residential address -- has address', () => {
    const hasAddress = createFakeUserStore();
    const appointmentInfoBox = mount(
      <AppointmentInfoBox store={hasAddress} onChange={() => {}} />,
    );
    expect(
      appointmentInfoBox.find('[data-testid="residentialAddress"]').text(),
    ).to.contains('PSC 808 Box 37');
    appointmentInfoBox.unmount();
  });
  it('Appointment Info Box -- dynamic details -- residential address -- no address', () => {
    const noAddress = createFakeUserStore(null, false, false);
    const appointmentInfoBoxNoAddress = mount(
      <AppointmentInfoBox store={noAddress} onChange={() => {}} />,
    );
    expect(
      appointmentInfoBoxNoAddress.exists('[data-testid="mailingAddress"]'),
    ).to.equal(false);
    appointmentInfoBoxNoAddress.unmount();
  });
  it('Appointment Info Box -- dynamic details --  phone numbers -- all phones', () => {
    // all phones
    const hasAllPhones = createFakeUserStore();
    const appointmentInfoBoxAllPhones = mount(
      <AppointmentInfoBox store={hasAllPhones} onChange={() => {}} />,
    );
    expect(
      appointmentInfoBoxAllPhones.find('[data-testid="phoneNumber"]').length,
    ).to.equal(4);
    appointmentInfoBoxAllPhones.unmount();

    // no phones
    const hasNoPhones = createFakeUserStore(null, false, false, {});
    const appointmentInfoBoxNoPhones = mount(
      <AppointmentInfoBox store={hasNoPhones} onChange={() => {}} />,
    );
    expect(
      appointmentInfoBoxNoPhones.find('[data-testid="phoneNumber"]').length,
    ).to.equal(0);
    appointmentInfoBoxNoPhones.unmount();

    // Home and mobile only
    const hasHomeAndMobile = createFakeUserStore(null, false, false, {
      hasHome: true,
      hasMobile: true,
    });
    const appointmentInfoBoxHomeAndMobilePhones = mount(
      <AppointmentInfoBox store={hasHomeAndMobile} onChange={() => {}} />,
    );
    expect(
      appointmentInfoBoxHomeAndMobilePhones.find('[data-testid="phoneNumber"]')
        .length,
    ).to.equal(2);
    appointmentInfoBoxHomeAndMobilePhones.unmount();
  });
  it('Appointment Info Box -- dynamic details --  phone numbers -- no phones', () => {
    // no phones
    const hasNoPhones = createFakeUserStore(null, false, false, {});
    const appointmentInfoBoxNoPhones = mount(
      <AppointmentInfoBox store={hasNoPhones} onChange={() => {}} />,
    );
    expect(
      appointmentInfoBoxNoPhones.find('[data-testid="phoneNumber"]').length,
    ).to.equal(0);
    appointmentInfoBoxNoPhones.unmount();
  });
  it('Appointment Info Box -- dynamic details --  phone numbers -- some phones', () => {
    // Home and mobile only
    const hasHomeAndMobile = createFakeUserStore(null, false, false, {
      hasHome: true,
      hasMobile: true,
    });
    const appointmentInfoBoxHomeAndMobilePhones = mount(
      <AppointmentInfoBox store={hasHomeAndMobile} onChange={() => {}} />,
    );
    expect(
      appointmentInfoBoxHomeAndMobilePhones.find('[data-testid="phoneNumber"]')
        .length,
    ).to.equal(2);
    appointmentInfoBoxHomeAndMobilePhones.unmount();
  });
});
