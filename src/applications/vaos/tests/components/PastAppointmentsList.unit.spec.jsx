import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
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
        vaos: {
          appointmentType: APPOINTMENT_TYPES.vaAppointment,
          videoType: null,
          isCommunityCare: false,
        },
        start: moment('2019-12-11T15:00:00Z'),
        status: APPOINTMENT_STATUS.booked,
        participant: [
          {
            actor: {
              reference: 'HealthcareService/var983_455',
              display: 'CHY OPT VAR1',
            },
          },
          {
            actor: {
              reference: 'Location/var983',
            },
          },
        ],
      },
      {
        vaos: {
          appointmentType: APPOINTMENT_TYPES.ccAppointment,
          timeZone: '-04:00 EDT',
          isCommunityCare: true,
          videoType: null,
        },
        contained: [
          {
            actor: {
              name: 'Practice name',
              address: {
                line: ['123 second st'],
                city: 'Northampton',
                state: 'MA',
                postalCode: '22222',
              },
              telecom: [
                {
                  system: 'phone',
                  value: '1234567890',
                },
              ],
            },
          },
        ],
        start: moment('2019-11-25T13:30:00Z'),
        status: APPOINTMENT_STATUS.booked,
      },
    ],
    facilityData: {},
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
    ).to.equal(appointments.facilityData.var442);

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

  it('should render focus on H3 tag', () => {
    // For some reason, testing for document.activeElement doesn't work
    // unless the component is first attached to a div
    const div = document.createElement('div');
    document.body.appendChild(div);

    const tree = mount(
      <PastAppointmentsList
        appointments={{
          ...appointments,
          pastStatus: FETCH_STATUS.loading,
        }}
        showPastAppointments
        pastSelectedIndex={0}
      />,
      { attachTo: div },
    );

    tree.setProps({
      appointments: {
        ...appointments,
        pastStatus: FETCH_STATUS.succeeded,
      },
    });

    expect(tree.find('h3[tabIndex="-1"]').exists()).to.be.true;
    expect(tree.find('h3[tabIndex="-1"]').text()).to.equal('Past appointments');
    expect(document.activeElement.id).to.equal('pastAppts');
    expect(document.activeElement.nodeName).to.equal('H3');

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

  it('should render the text that describes which months is being displayed', () => {
    const tree = shallow(
      <PastAppointmentsList
        appointments={appointments}
        showPastAppointments
        pastSelectedIndex={0}
      />,
    );

    const display = tree.find(
      'span.vads-u-font-size--sm.vads-u-font-weight--normal',
    );
    expect(display.text()).to.contains('Past 3 months');

    tree.unmount();
  });
});
