import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import moment from 'moment';
import { PastAppointmentsList } from '../../components/PastAppointmentsList';
import {
  FETCH_STATUS,
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
} from '../../utils/constants';
import { getPastAppointmentDateRangeOptions } from '../../utils/appointment';

describe('VAOS <PastAppointmentsList>', () => {
  const appointments = {
    pastStatus: FETCH_STATUS.succeeded,
    pastSelectedIndex: 0,
    past: [
      {
        appointmentType: APPOINTMENT_TYPES.vaAppointment,
        appointmentDate: moment('2019-12-11T15:00:00Z'),
        clinicId: '455',
        facilityId: '983',
        status: APPOINTMENT_STATUS.booked,
      },
      {
        appointmentType: APPOINTMENT_TYPES.ccAppointment,
        appointmentDate: moment('2019-11-25T13:30:00Z'),
        timeZone: '-04:00 EDT',
        status: APPOINTMENT_STATUS.booked,
      },
      {
        appointmentType: APPOINTMENT_TYPES.request,
        status: APPOINTMENT_STATUS.cancelled,
      },
    ],
    systemClinicToFacilityMap: {
      '983_455': {},
    },
  };

  it('should display loading indicator', () => {
    const defaultProps = {
      appointments: {
        past: [],
        pastStatus: FETCH_STATUS.loading,
        pastSelectedIndex: 0,
        facilityData: {},
      },
    };

    const tree = shallow(
      <PastAppointmentsList
        {...defaultProps}
        location={location}
        showPastAppointments
      />,
    );
    expect(tree.find('LoadingIndicator').length).to.equal(1);
    tree.unmount();
  });

  it('should fetch past appointments', () => {
    const dateRangeOptions = getPastAppointmentDateRangeOptions(
      moment('2020-02-02'),
    );
    const defaultProps = {
      appointments: {
        past: [],
        pastStatus: FETCH_STATUS.notStarted,
        pastSelectedIndex: 0,
        facilityData: {},
      },
    };

    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <PastAppointmentsList
        {...defaultProps}
        dateRangeOptions={dateRangeOptions}
        location={location}
        showPastAppointments
        fetchPastAppointments={fetchPastAppointments}
      />,
    );
    expect(fetchPastAppointments.called).to.be.true;
    expect(fetchPastAppointments.firstCall.args[0]).to.equal(
      dateRangeOptions[defaultProps.appointments.pastSelectedIndex].startDate,
    );
    expect(fetchPastAppointments.firstCall.args[1]).to.equal(
      dateRangeOptions[defaultProps.appointments.pastSelectedIndex].endDate,
    );
    tree.unmount();
  });

  it('should render 2 appointments', () => {
    const tree = shallow(
      <PastAppointmentsList
        appointments={appointments}
        showPastAppointments
        pastSelectedIndex={0}
      />,
    );

    expect(tree.find('ConfirmedAppointmentListItem').length).to.equal(2);
    expect(
      tree
        .find('ConfirmedAppointmentListItem')
        .first()
        .props().facility,
    ).to.equal(appointments.systemClinicToFacilityMap['983_455']);

    tree.unmount();
  });

  it('should render date range dropdown', () => {
    const tree = shallow(
      <PastAppointmentsList appointments={appointments} showPastAppointments />,
    );

    expect(tree.find('PastAppointmentsDateDropdown').exists()).to.be.true;
    tree.unmount();
  });

  it('should display AlertBox if fetch failed', () => {
    const defaultProps = {
      appointments: {
        past: [{}],
        pastStatus: FETCH_STATUS.failed,
        pastSelectedIndex: 0,
      },
    };

    const tree = shallow(
      <PastAppointmentsList
        {...defaultProps}
        location={location}
        showPastAppointments
      />,
    );

    expect(tree.find('AlertBox').exists()).to.be.true;
    tree.unmount();
  });

  it('should display no appointments message if no appointments', () => {
    const defaultProps = {
      appointments: {
        past: [],
        pastStatus: FETCH_STATUS.succeeded,
        pastSelectedIndex: 0,
      },
    };

    const tree = shallow(
      <PastAppointmentsList
        {...defaultProps}
        location={location}
        showPastAppointments
      />,
    );

    expect(tree.find('h4').text()).to.equal(
      'You don’t have any appointments in the selected date range',
    );
    tree.unmount();
  });

  it('should fetch past on past dropdown change', () => {
    const defaultProps = {
      appointments: {
        past: [],
        pastStatus: FETCH_STATUS.notStarted,
        pastSelectedIndex: 0,
      },
    };

    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <PastAppointmentsList
        {...defaultProps}
        fetchPastAppointments={fetchPastAppointments}
        showPastAppointments
      />,
    );

    const instance = tree.instance();
    instance.onDateRangeChange('1');
    expect(fetchPastAppointments.callCount).to.equal(2);
    tree.unmount();
  });

  it('should redirect to future if showPastAppointments is false', () => {
    const defaultProps = {
      appointments: {
        past: [],
        pastStatus: FETCH_STATUS.notStarted,
        pastSelectedIndex: 0,
      },
      router: {
        push: sinon.spy(),
      },
    };
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <PastAppointmentsList
        {...defaultProps}
        fetchPastAppointments={fetchPastAppointments}
      />,
    );

    expect(defaultProps.router.push.called).to.be.true;
    expect(defaultProps.router.push.firstCall.args[0]).to.equal('/');
    expect(fetchPastAppointments.called).to.be.false;
    tree.unmount();
  });
});
