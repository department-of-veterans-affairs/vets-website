import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { FETCH_STATUS, APPOINTMENT_TYPES } from '../../utils/constants';

import { FutureAppointmentsList } from '../../components/FutureAppointmentsList';

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
    expect(tree.find('h3').text()).to.equal('Upcoming appointments');
    expect(tree.find('LoadingIndicator').length).to.equal(1);
    tree.unmount();
  });

  it('should fetch future appointments', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.notStarted,
        facilityData: {},
      },
      location: {
        pathname: '/upcoming',
      },
    };

    const fetchFutureAppointments = sinon.spy();

    const tree = mount(
      <FutureAppointmentsList
        fetchFutureAppointments={fetchFutureAppointments}
        {...defaultProps}
      />,
    );
    expect(fetchFutureAppointments.called).to.be.true;
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
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
          legacyVAR: {
            facilityId: '983',
            clinicId: '455',
          },
        },
        {
          vaos: { appointmentType: APPOINTMENT_TYPES.ccAppointment },
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

  it('should show past appointments link if showPastAppointmentLinks is true', () => {
    const defaultProps = {
      appointments: {
        future: [{}],
        futureStatus: FETCH_STATUS.succeeded,
        facilityData: {},
      },
      cancelAppointment,
      fetchRequestMessages,
      showScheduleButton,
      startNewAppointmentFlow,
      showPastAppointmentsLink: true,
    };

    const tree = mount(<FutureAppointmentsList {...defaultProps} />);

    expect(tree.find('a').text()).to.equal('go to My HealtheVet');
    tree.unmount();
  });

  it('should fire a GA event when clicking past appointments link', () => {
    const defaultProps = {
      appointments: {
        future: [{}],
        futureStatus: FETCH_STATUS.succeeded,
        facilityData: {},
      },
      cancelAppointment,
      fetchRequestMessages,
      showScheduleButton,
      startNewAppointmentFlow,
      showPastAppointmentsLink: true,
    };

    const tree = mount(<FutureAppointmentsList {...defaultProps} />);

    tree
      .find('a')
      .at(0)
      .simulate('click');
    expect(global.window.dataLayer[0].event).to.equal(
      'vaos-past-appointments-legacy-link-clicked',
    );
    tree.unmount();
  });

  it('should display AlertBox if fetch failed', () => {
    const defaultProps = {
      appointments: {
        future: [{}],
        futureStatus: FETCH_STATUS.failed,
        facilityData: {},
      },
      cancelAppointment,
      fetchRequestMessages,
      showScheduleButton,
      startNewAppointmentFlow,
    };

    const tree = mount(<FutureAppointmentsList {...defaultProps} />);

    expect(tree.find('AlertBox').exists()).to.be.true;
    tree.unmount();
  });

  it('should display NoAppointments if no appointments', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.succeeded,
        facilityData: {},
      },
      cancelAppointment,
      fetchRequestMessages,
      showScheduleButton,
      startNewAppointmentFlow,
    };

    const tree = mount(<FutureAppointmentsList {...defaultProps} />);

    expect(tree.find('NoAppointments').exists()).to.be.true;
    tree.unmount();
  });
});
