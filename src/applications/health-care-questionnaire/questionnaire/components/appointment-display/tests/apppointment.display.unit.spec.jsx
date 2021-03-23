import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AppointmentDisplay from '../AppointmentDisplay';
import testData from '../../../../shared/api/mock-data/fhir/upcoming.appointment.not.started.primary.care.questionnaire.json';

describe('health care questionnaire - display an appointment -- ', () => {
  it('has appointment data', () => {
    const mountedComponent = mount(
      <AppointmentDisplay appointmentData={testData} />,
    );
    expect(
      mountedComponent.find('[data-testid="appointment-location"]').text(),
      'TEM MH PSO TRS IND93EH 2, NEW AMSTERDAM CBOC',
    );
    expect(
      mountedComponent.find('[data-testid="appointment-time"]').text(),
    ).to.match(/([\d]|[\d][\d]):[\d][\d]\s[a|p].m./);
    expect(
      mountedComponent.find('[data-testid="appointment-date"]').text(),
    ).to.equal('Thursday, November 25th, 2021');

    mountedComponent.unmount();
  });
  it('does not have appointment data', () => {
    const mountedComponent = mount(
      <AppointmentDisplay appointmentData={undefined} />,
    );
    expect(
      mountedComponent.find('[data-testid="appointment-location"]').exists(),
    ).to.be.false;
    expect(mountedComponent.find('[data-testid="appointment-time"]').exists())
      .to.be.false;
    expect(mountedComponent.find('[data-testid="appointment-date"]').exists())
      .to.be.false;

    mountedComponent.unmount();
  });
  it('does bold', () => {
    const mountedComponent = mount(
      <AppointmentDisplay appointmentData={testData} bold />,
    );
    const classes = mountedComponent.find('.appointment-details').props('class')
      .className;
    expect(classes).to.contain('vads-u-font-weight--bold');

    mountedComponent.unmount();
  });
  it('does not bold', () => {
    const mountedComponent = mount(
      <AppointmentDisplay appointmentData={testData} bold={false} />,
    );
    const classes = mountedComponent.find('.appointment-details').props('class')
      .className;
    expect(classes).to.not.contain('vads-u-font-weight--bold');

    mountedComponent.unmount();
  });
});
