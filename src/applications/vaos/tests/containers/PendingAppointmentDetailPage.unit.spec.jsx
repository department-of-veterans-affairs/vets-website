import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { PendingAppointmentDetailPage } from '../../containers/PendingAppointmentDetailPage';

describe('VAOS <PendingAppointmentDetailPage>', () => {
  it('should render a loading indicator', () => {
    const fetchPendingAppointments = sinon.spy();
    const tree = shallow(
      <PendingAppointmentDetailPage
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
      <PendingAppointmentDetailPage
        fetchPendingAppointments={fetchPendingAppointments}
        appointment={appointment}
        status="succeeded"
      />,
    );

    expect(fetchPendingAppointments.called).to.be.true;
    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    expect(tree.text()).to.contain(appointment.appointmentType);
    expect(tree.text()).to.contain('555 555-5555, in the morning');
    tree.unmount();
  });

  it('should render contact info morning and afternoon text', () => {
    const fetchPendingAppointments = sinon.spy();
    const appointment = {
      appointmentType: 'Primary Care',
      friendlyLocationName: 'Testing',
      facility: {},
      bestTimetoCall: ['Morning', 'Afternoon'],
      phoneNumber: '555 555-5555',
    };
    const tree = shallow(
      <PendingAppointmentDetailPage
        fetchPendingAppointments={fetchPendingAppointments}
        appointment={appointment}
        status="succeeded"
      />,
    );

    expect(tree.text()).to.contain('555 555-5555, in the morning or afternoon');
    tree.unmount();
  });

  it('should render contact info morning, afternoon, and evening text', () => {
    const fetchPendingAppointments = sinon.spy();
    const appointment = {
      appointmentType: 'Primary Care',
      friendlyLocationName: 'Testing',
      facility: {},
      bestTimetoCall: ['Morning', 'Afternoon', 'Evening'],
      phoneNumber: '555 555-5555',
    };
    const tree = shallow(
      <PendingAppointmentDetailPage
        fetchPendingAppointments={fetchPendingAppointments}
        appointment={appointment}
        status="succeeded"
      />,
    );

    expect(tree.text()).to.contain(
      '555 555-5555, in the morning, afternoon, or evening',
    );
    tree.unmount();
  });
});
