import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { PendingAppointmentPage } from '../../containers/PendingAppointmentPage';

describe('VAOS <PendingAppointmentPage>', () => {
  it('should render a loading indicator', () => {
    const fetchPendingAppointments = sinon.spy();
    const tree = shallow(
      <PendingAppointmentPage
        fetchPendingAppointments={fetchPendingAppointments}
        status="loading"
      />,
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    expect(fetchPendingAppointments.called).to.be.true;
    tree.unmount();
  });

  it('should render pending appointment', () => {
    const fetchPendingAppointments = sinon.spy();
    const appointment = {
      appointmentType: 'Primary Care',
      friendlyLocationName: 'Testing',
      facility: {},
      bestTimetoCall: ['Morning'],
      phoneNumber: '555 555-5555',
    };
    const tree = shallow(
      <PendingAppointmentPage
        fetchPendingAppointments={fetchPendingAppointments}
        appointment={appointment}
        status="successful"
      />,
    );

    expect(fetchPendingAppointments.called).to.be.true;
    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    expect(tree.text()).to.contain(appointment.appointmentType);
    expect(tree.text()).to.contain('555 555-5555, in the morning');
    tree.unmount();
  });
});
