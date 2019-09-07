import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { AppointmentListsPage } from '../../containers/AppointmentListsPage';

describe('VAOS <AppointmentListsPage>', () => {
  it('should render a loading indicator', () => {
    const defaultProps = {
      appointments: {
        pending: [
          {
            id: 1,
          },
          { id: 2 },
        ],
        pendingLoading: true,
        confirmed: [
          {
            id: 1,
          },
        ],
        confirmedLoading: true,
        past: [],
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

  it('should render badge counts for each appointment type', () => {
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

    const badges = tree.find('span.vaos-appt-list__badge');
    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    expect(badges.length).to.equal(2);

    expect(badges.at(0).text()).to.have.string('1');
    expect(badges.at(1).text()).to.have.string('2');

    tree.unmount();
  });
});
