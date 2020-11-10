import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AppointmentDisplay from '../../../components/veteran-info/AppointmentDisplay';
import testData from '../../../api/appointment-data.json';

describe('healthcare-questionnaire - display an appointment -- ', () => {
  it('has appointment data', () => {
    const mountedComponent = mount(
      <AppointmentDisplay appointment={testData} />,
    );
    expect(
      mountedComponent.find('[data-testid="facility-name"]').text(),
    ).to.equal('Douglas VA Medical Center');
    expect(
      mountedComponent.find('[data-testid="appointment-time"]').text(),
    ).to.match(/([\d]|[\d][\d]):[\d][\d]\s[a|p].m./);
    expect(
      mountedComponent.find('[data-testid="appointment-date"]').text(),
    ).to.equal('December 2nd, 2020.');

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
