import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { FETCH_STATUS, APPOINTMENT_TYPES } from '../../utils/constants';

import FutureAppointmentsList from '../../components/FutureAppointmentsList';

describe('VAOS <FutureAppointmentsList>', () => {
  const cancelAppointment = sinon.spy();
  const fetchRequestMessages = sinon.spy();
  const showScheduleButton = sinon.spy();
  const startNewAppointmentFlow = sinon.spy();

  it('should display loading indicator', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.loading,
        facilityData: {},
      },
      cancelAppointment,
      fetchRequestMessages,
      showScheduleButton,
      startNewAppointmentFlow,
    };

    const tree = mount(<FutureAppointmentsList {...defaultProps} />);
    expect(tree.find('LoadingIndicator').length).to.equal(1);
    tree.unmount();
  });

  it('should render 4 appointments', () => {
    const appointments = {
      facilityData: {},
      futureStatus: FETCH_STATUS.succeeded,
      future: [
        {
          appointmentType: APPOINTMENT_TYPES.request,
        },
        {
          appointmentType: APPOINTMENT_TYPES.ccRequest,
        },
        {
          appointmentType: APPOINTMENT_TYPES.vaAppointment,
          facilityId: '983',
          clinicId: '455',
        },
        {
          appointmentType: APPOINTMENT_TYPES.ccAppointment,
        },
      ],
      systemClinicToFacilityMap: {
        '983_455': {},
      },
    };

    const tree = shallow(
      <FutureAppointmentsList showScheduleButton appointments={appointments} />,
    );

    expect(tree.find('ConfirmedAppointmentListItem').length).to.equal(2);
    expect(
      tree
        .find('ConfirmedAppointmentListItem')
        .first()
        .props().facility,
    ).to.equal(appointments.systemClinicToFacilityMap['983_455']);
    expect(tree.find('AppointmentRequestListItem').length).to.equal(2);

    tree.unmount();
  });
});
