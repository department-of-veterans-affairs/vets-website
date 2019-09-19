import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { ConfirmedAppointmentListPage } from '../../containers/ConfirmedAppointmentListPage';

describe('VAOS <ConfirmedAppointmentListPage>', () => {
  it('should render a loading indicator', () => {
    const fetchConfirmedAppointments = sinon.spy();
    const form = shallow(
      <ConfirmedAppointmentListPage
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
      <ConfirmedAppointmentListPage
        fetchConfirmedAppointments={fetchConfirmedAppointments}
        status="succeeded"
        appointments={appointments}
      />,
    );

    expect(fetchConfirmedAppointments.called).to.be.true;
    expect(form.find('LoadingIndicator').exists()).to.be.false;
    expect(form.find('ConfirmedAppointmentListItem').length).to.equal(2);
    form.unmount();
  });
});
