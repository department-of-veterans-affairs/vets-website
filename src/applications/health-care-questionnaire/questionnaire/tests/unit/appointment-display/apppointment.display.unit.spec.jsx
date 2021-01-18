import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AppointmentDisplay from '../../../components/veteran-info/AppointmentDisplay';
import testData from '../../../api/appointment-data.json';

describe('health care questionnaire - display an appointment -- ', () => {
  it('has appointment data', () => {
    const mountedComponent = mount(
      <AppointmentDisplay appointment={testData.data} />,
    );
    expect(
      mountedComponent.find('[data-testid="facility-name"]').text(),
    ).to.equal('VDS Facility Display Name');
    expect(
      mountedComponent.find('[data-testid="appointment-time"]').text(),
    ).to.match(/([\d]|[\d][\d]):[\d][\d]\s[a|p].m./);
    expect(
      mountedComponent.find('[data-testid="appointment-date"]').text(),
    ).to.equal('January 26th, 2021.');

    mountedComponent.unmount();
  });
  it('does not have appointment data', () => {
    const mountedComponent = mount(
      <AppointmentDisplay appointment={undefined} />,
    );
    expect(mountedComponent.find('[data-testid="facility-name"]').exists()).to
      .be.false;
    expect(mountedComponent.find('[data-testid="appointment-time"]').exists())
      .to.be.false;
    expect(mountedComponent.find('[data-testid="appointment-date"]').exists())
      .to.be.false;

    mountedComponent.unmount();
  });
});
