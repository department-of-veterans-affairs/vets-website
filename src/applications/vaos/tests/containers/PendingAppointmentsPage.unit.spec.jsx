import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { PendingAppointmentsPage } from '../../containers/PendingAppointmentsPage';

describe('VAOS <PendingAppointmentsPage>', () => {
  it('should render a loading indicator', () => {
    const fetchPendingAppointments = sinon.spy();
    const form = shallow(
      <PendingAppointmentsPage
        fetchPendingAppointments={fetchPendingAppointments}
        status="loading"
      />,
    );

    expect(form.find('LoadingIndicator').exists()).to.be.true;
    expect(fetchPendingAppointments.called).to.be.true;
    form.unmount();
  });

  it('should render pending appointments', () => {
    const fetchPendingAppointments = sinon.spy();
    const appointments = [{}, {}];
    const form = shallow(
      <PendingAppointmentsPage
        fetchPendingAppointments={fetchPendingAppointments}
        status="succeeded"
        appointments={appointments}
      />,
    );

    expect(fetchPendingAppointments.called).to.be.true;
    expect(form.find('LoadingIndicator').exists()).to.be.false;
    expect(form.find('PendingAppointment').length).to.equal(2);
    form.unmount();
  });
});
