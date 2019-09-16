import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { ConfirmedAppointmentsPage } from '../../containers/ConfirmedAppointmentsPage';

describe('VAOS <ConfirmedAppointmentsPage>', () => {
  it('should render a loading indicator', () => {
    const fetchConfirmedAppointments = sinon.spy();
    const form = shallow(
      <ConfirmedAppointmentsPage
        fetchConfirmedAppointments={fetchConfirmedAppointments}
        status="loading"
      />,
    );

    expect(form.find('LoadingIndicator').exists()).to.be.true;
    expect(fetchConfirmedAppointments.called).to.be.true;
    form.unmount();
  });

  it('should render confirmed appointments', () => {
    const fetchConfirmedAppointments = sinon.spy();
    const appointments = [{}, {}];
    const form = shallow(
      <ConfirmedAppointmentsPage
        fetchConfirmedAppointments={fetchConfirmedAppointments}
        status="succeeded"
        appointments={appointments}
      />,
    );

    expect(fetchConfirmedAppointments.called).to.be.true;
    expect(form.find('LoadingIndicator').exists()).to.be.false;
    expect(form.find('ConfirmedAppointment').length).to.equal(2);
    form.unmount();
  });
});
