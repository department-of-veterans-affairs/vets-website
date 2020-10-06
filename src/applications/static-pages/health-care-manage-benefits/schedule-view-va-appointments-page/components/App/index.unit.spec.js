// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import AuthContent from '../AuthContent';
import LegacyContent from '../LegacyContent';
import UnauthContent from '../UnauthContent';
import { App } from './index';

describe('Get Medical Records Page <App>', () => {
  it('renders what we expect when the feature toggle is turned off', () => {
    const wrapper = shallow(
      <App showNewScheduleViewAppointmentsPage={false} />,
    );
    expect(wrapper.find(LegacyContent)).to.have.lengthOf(1);
  });

  it('renders what we expect when there is a Cerner facility exception', () => {
    const wrapper = shallow(
      <App
        facilityIDs={['1']}
        isCernerPatient={false}
        showAuthFacilityIDExceptions={['1']}
        showNewScheduleViewAppointmentsPage
      />,
    );
    expect(wrapper.find(AuthContent)).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('renders what we expect when a Cerner patient', () => {
    const wrapper = shallow(
      <App showNewScheduleViewAppointmentsPage isCernerPatient />,
    );
    expect(wrapper.find(AuthContent)).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('renders what we expect when not a Cerner patient', () => {
    const wrapper = shallow(
      <App showNewScheduleViewAppointmentsPage isCernerPatient={false} />,
    );
    expect(wrapper.find(UnauthContent)).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
