import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AppointmentDisplay from '../../../components/appointment-display/AppointmentDisplay';
import testData from '../../../api/appointment-data.json';

describe('health care questionnaire - display an appointment -- ', () => {
  it('has appointment data', () => {
    const mountedComponent = mount(
      <AppointmentDisplay appointment={testData.data} />,
    );
    expect(
      mountedComponent.find('[data-testid="appointment-location"]').text(),
    ).to.equal('CHY PC VAR2, VDS Facility Display Name');
    expect(
      mountedComponent.find('[data-testid="appointment-time"]').text(),
    ).to.match(/([\d]|[\d][\d]):[\d][\d]\s[a|p].m./);
    expect(
      mountedComponent.find('[data-testid="appointment-date"]').text(),
    ).to.equal('Tuesday, January 26th, 2021');

    mountedComponent.unmount();
  });
  it('does not have appointment data', () => {
    const mountedComponent = mount(
      <AppointmentDisplay appointment={undefined} />,
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
      <AppointmentDisplay appointment={testData.data} bold />,
    );
    const classes = mountedComponent.find('.appointment-details').props('class')
      .className;
    expect(classes).to.contain('vads-u-font-weight--bold');

    mountedComponent.unmount();
  });
  it('does not bold', () => {
    const mountedComponent = mount(
      <AppointmentDisplay appointment={testData.data} bold={false} />,
    );
    const classes = mountedComponent.find('.appointment-details').props('class')
      .className;
    expect(classes).to.not.contain('vads-u-font-weight--bold');

    mountedComponent.unmount();
  });
});
