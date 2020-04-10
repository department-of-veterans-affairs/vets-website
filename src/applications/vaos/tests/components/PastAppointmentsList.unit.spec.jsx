import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import moment from 'moment';
import {
  FETCH_STATUS,
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
} from '../../utils/constants';
import PastAppointmentsList from '../../components/PastAppointmentsList';
import { getPastAppointmentDateRangeOptions } from '../../utils/appointment';

describe('VAOS <PastAppointmentsList>', () => {
  const cancelAppointment = sinon.spy();
  const fetchRequestMessages = sinon.spy();
  const showScheduleButton = sinon.spy();
  const startNewAppointmentFlow = sinon.spy();

  const dateRangeOptions = getPastAppointmentDateRangeOptions(
    moment('2020-02-02'),
  );

  const appointments = {
    facilityData: {},
    pastStatus: FETCH_STATUS.succeeded,
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
        facilityData: {},
      },
      cancelAppointment,
      fetchRequestMessages,
      showScheduleButton,
      startNewAppointmentFlow,
    };

    const tree = mount(
      <PastAppointmentsList
        {...defaultProps}
        dateRangeOptions={dateRangeOptions}
      />,
    );
    expect(tree.find('LoadingIndicator').length).to.equal(1);
    tree.unmount();
  });

  it('should render 2 appointments', () => {
    const tree = shallow(
      <PastAppointmentsList
        appointments={appointments}
        dateRangeOptions={dateRangeOptions}
        selectedDateRangeIndex={0}
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
      <PastAppointmentsList
        appointments={appointments}
        dateRangeOptions={dateRangeOptions}
        selectedDateRangeIndex={0}
      />,
    );

    expect(tree.find('PastAppointmentsDateDropdown').exists()).to.be.true;
    tree.unmount();
  });
});
