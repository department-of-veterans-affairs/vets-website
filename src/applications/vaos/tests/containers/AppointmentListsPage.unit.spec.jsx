import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { AppointmentListsPage } from '../../containers/AppointmentListsPage';

describe('VAOS <AppointmentListsPage>', () => {
  it('should render a loading indicator', () => {
    const fetchUserAppointmentsSummary = sinon.spy();
    const form = shallow(
      <AppointmentListsPage
        fetchUserAppointmentsSummary={fetchUserAppointmentsSummary}
        loading
      />,
    );

    expect(form.find('LoadingIndicator').exists()).to.be.true;
    expect(fetchUserAppointmentsSummary.called).to.be.true;
    form.unmount();
  });

  //  it('should render pending appointments', () => {
  //   const fetchPendingAppointments = sinon.spy();
  //   const appointments = [{}, {}];
  //   const form = shallow(
  //     <PendingAppointmentsPage
  //       fetchPendingAppointments={fetchPendingAppointments}
  //       appointments={appointments}
  //     />,
  //   );

  //    expect(fetchPendingAppointments.called).to.be.true;
  //   expect(form.find('LoadingIndicator').exists()).to.be.false;
  //   expect(form.find('PendingAppointment').length).to.equal(2);
  //   form.unmount();
  // });
});
