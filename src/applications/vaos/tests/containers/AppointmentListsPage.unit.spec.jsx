import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { AppointmentListsPage } from '../../containers/AppointmentListsPage';

describe('VAOS <AppointmentListsPage>', () => {
  it('should render a loading indicator', () => {
    const defaultProps = {
      appointments: {
        pendingLoading: true,
        confirmedLoading: true,
        pastLoading: true,
      },
    };

    const fetchConfirmedAppointments = sinon.spy();
    const fetchPendingAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentListsPage
        fetchConfirmedAppointments={fetchConfirmedAppointments}
        fetchPendingAppointments={fetchPendingAppointments}
        {...defaultProps}
      />,
    );
    expect(fetchConfirmedAppointments.called).to.be.true;
    expect(fetchPendingAppointments.called).to.be.true;
    tree.unmount();
  });

  it('should render 3 appointments types and badge counts for each', () => {
    const defaultProps = {
      appointments: {
        pending: [
          {
            id: 1,
          },
          { id: 2 },
        ],
        pendingLoading: false,
        confirmed: [
          {
            id: 1,
          },
        ],
        confirmedLoading: false,
        past: [],
        pastLoading: false,
      },
    };

    const fetchConfirmedAppointments = sinon.spy();
    const fetchPendingAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentListsPage
        fetchConfirmedAppointments={fetchConfirmedAppointments}
        fetchPendingAppointments={fetchPendingAppointments}
        {...defaultProps}
      />,
    );

    const headers = tree.find('h2.vads-u-font-size--lg');
    expect(headers.length).to.equal(3);
    expect(headers.at(0).text()).to.have.string('Confirmed appointments');
    expect(headers.at(1).text()).to.have.string('Pending appointments');
    expect(headers.at(2).text()).to.have.string('Appointment history');

    const badges = tree.find('span.vaos-appt-list__badge');
    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    expect(badges.length).to.equal(2);
    expect(badges.at(0).text()).to.have.string('1');
    expect(badges.at(1).text()).to.have.string('2');

    tree.unmount();
  });
});
