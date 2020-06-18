import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import moment from 'moment';

import {
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
  VIDEO_TYPES,
} from '../../utils/constants';
import ConfirmedAppointmentListItem from '../../components/ConfirmedAppointmentListItem';

describe('VAOS <ConfirmedAppointmentListItem> Regular Appointment', () => {
  const appointment = {
    resourceType: 'Appointment',
    status: APPOINTMENT_STATUS.booked,
    description: 'NO ACTION TAKEN/TODAY',
    start: '2019-12-11T10:00:00-07:00',
    minutesDuration: 60,
    comment: 'Follow-up/Routine: Instructions',
    participant: [
      {
        actor: {
          reference: 'HealthcareService/var983_455',
          display: 'C&P BEV AUDIO FTC1',
        },
      },
    ],
    contained: null,
    id: '17dd714287e151195b99164cc1a8e49a',
    vaos: {
      isPastAppointment: false,
      appointmentType: APPOINTMENT_TYPES.vaAppointment,
      videoType: null,
      isCommunityCare: false,
      timeZone: null,
    },
  };

  const facility = {
    id: 'var983',
    name: 'Cheyenne VA Medical Center',
    address: {
      postalCode: '82001-5356',
      city: 'Cheyenne',
      state: 'WY',
      line: ['2360 East Pershing Boulevard'],
    },
    telecom: [
      {
        system: 'phone',
        value: '307-778-7550',
      },
    ],
  };

  const cancelAppointment = sinon.spy();

  it('should render all expected information', () => {
    const { getByText, baseElement } = render(
      <ConfirmedAppointmentListItem
        showCancelButton
        cancelAppointment={cancelAppointment}
        appointment={appointment}
        facility={facility}
      />,
    );

    expect(getByText(/Confirmed/)).to.be.ok;
    expect(baseElement.querySelector('.fa-check-circle')).to.be.ok;

    expect(getByText(/Wednesday, December 11, 2019/).nodeName).to.equal('H3');
    expect(getByText('C&P BEV AUDIO FTC1')).to.be.ok;
    expect(getByText(/Cheyenne VA Medical Center/)).to.be.ok;
    expect(getByText(/2360 East Pershing Boulevard/)).to.be.ok;
    expect(getByText(/Cheyenne, WY 82001-5356/)).to.be.ok;
    expect(getByText(/Follow-up\/Routine/)).to.be.ok;
    expect(getByText(/Instructions/)).to.be.ok;

    fireEvent.click(getByText('Cancel appointment'));
    expect(cancelAppointment.called).to.be.true;
  });

  it('should not show instructions if comment does not start with preset purpose text', () => {
    const appt = {
      ...appointment,
      comment: 'some comment',
    };

    const { queryByText } = render(
      <ConfirmedAppointmentListItem
        showCancelButton
        cancelAppointment={cancelAppointment}
        appointment={appt}
        facility={facility}
      />,
    );

    expect(queryByText(/some comment/)).to.not.be.ok;
  });
});

describe('VAOS <ConfirmedAppointmentListItem> Community Care Appointment', () => {
  const appointment = {
    resourceType: 'Appointment',
    status: APPOINTMENT_STATUS.booked,
    description: null,
    start: '2019-05-22T10:00:00Z',
    minutesDuration: 60,
    comment: 'Instruction text',
    participant: [
      {
        actor: {
          reference: 'Practitioner/PRACTITIONER_ID',
          display: 'Rick Katz',
        },
      },
    ],
    contained: [
      {
        actor: {
          name: 'My Clinic',
          address: {
            line: ['123 second st'],
            city: 'Northampton',
            state: 'MA',
            postalCode: '22222',
          },
          telecom: [
            {
              system: 'phone',
              value: '(703) 555-1264',
            },
          ],
        },
      },
    ],
    id: '8a4885896a22f88f016a2cb7f5de0062',
    vaos: {
      isPastAppointment: false,
      appointmentType: APPOINTMENT_TYPES.ccAppointment,
      videoType: null,
      isCommunityCare: true,
      timeZone: 'UTC',
    },
  };

  const tree = mount(
    <ConfirmedAppointmentListItem appointment={appointment} />,
  );

  it('should have a status of "confirmed"', () => {
    expect(
      tree
        .find('span')
        .at(2)
        .text(),
    ).to.contain('Confirmed');
  });

  it('should have an h3 with date', () => {
    expect(
      tree
        .find('h3')
        .text()
        .trim(),
    ).to.contain('May 22, 2019 at 10:00 a.m.');
  });

  it('should display clinic name', () => {
    expect(tree.text()).to.contain('My Clinic');
  });

  it('should display clinic address', () => {
    expect(tree.text()).to.contain('123 second stNorthampton, MA 22222');
  });

  it('should display instructions', () => {
    expect(tree.text()).to.contain('Instruction text');
  });

  it('should have a green top border if in future', () => {
    const newTree = mount(
      <ConfirmedAppointmentListItem appointment={appointment} />,
    );

    expect(newTree.find('.vads-u-border-color--green').exists()).to.equal(true);
    newTree.unmount();
  });

  it('should not have a green top border if time is isPastAppointment', () => {
    const appt = {
      ...appointment,
      vaos: {
        ...appointment.vaos,
        isPastAppointment: true,
      },
    };

    const newTree = mount(<ConfirmedAppointmentListItem appointment={appt} />);
    expect(newTree.find('.vads-u-border-color--green').exists()).to.equal(
      false,
    );
    newTree.unmount();
  });
});

describe('VAOS <ConfirmedAppointmentListItem> Video Appointment', () => {
  const apptTime = moment()
    .add(20, 'minutes')
    .format();
  const appointment = {
    resourceType: 'Appointment',
    status: APPOINTMENT_STATUS.booked,
    description: 'FUTURE',
    start: apptTime,
    minutesDuration: 20,
    comment: '',
    participant: null,
    contained: [
      {
        resourceType: 'HealthcareService',
        id: 'HealthcareService/var8a74bdfa-0e66-4848-87f5-0d9bb413ae6d',
        type: [
          {
            text: 'Patient Virtual Meeting Room',
          },
        ],
        telecom: [
          {
            system: 'url',
            value:
              'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=3242949390#',
            period: {
              start: apptTime,
            },
          },
        ],
      },
    ],
    legacyVAR: {
      apiData: {
        facilityId: '983',
      },
    },
    id: '05760f00c80ae60ce49879cf37a05fc8',
    vaos: {
      isPastAppointment: false,
      appointmentType: APPOINTMENT_TYPES.vaAppointment,
      videoType: VIDEO_TYPES.videoConnect,
      isCommunityCare: false,
      timeZone: null,
    },
  };

  it('should render expected video information', () => {
    const { getByText, queryByText } = render(
      <ConfirmedAppointmentListItem appointment={appointment} />,
    );

    expect(getByText(/join session/i).getAttribute('disabled')).not.to.be.ok;
    expect(queryByText(/prepare for video visit/i)).not.to.be.ok;
  });

  it('should reveal medication review instructions', () => {
    const { getByText, queryByText, findByText } = render(
      <ConfirmedAppointmentListItem
        appointment={{
          ...appointment,
          comment: 'Medication Review',
        }}
      />,
    );

    expect(queryByText(/medication review/i)).to.not.be.ok;
    fireEvent.click(getByText(/prepare for video visit/i));

    return expect(findByText(/medication review/i)).to.eventually.be.ok;
  });

  it('should reveal video visit instructions', () => {
    const { getByText, queryByText, findByText } = render(
      <ConfirmedAppointmentListItem
        appointment={{
          ...appointment,
          comment: 'Video Visit Preparation',
        }}
      />,
    );

    expect(queryByText(/before your appointment/i)).to.not.be.ok;
    fireEvent.click(getByText(/prepare for video visit/i));

    return expect(findByText('Before your appointment:')).to.eventually.be.ok;
  });
});

describe('VAOS <ConfirmedAppointmentListItem> Canceled Appointment', () => {
  const appointment = {
    resourceType: 'Appointment',
    status: APPOINTMENT_STATUS.cancelled,
    description: 'NO ACTION TAKEN/TODAY',
    start: '2019-12-11T10:00:00-07:00',
    minutesDuration: 60,
    participant: [
      {
        actor: {
          reference: 'HealthcareService/var983_455',
          display: 'C&P BEV AUDIO FTC1',
        },
      },
    ],
    contained: null,
    legacyVAR: {
      id: '17dd714287e151195b99164cc1a8e49a',
      apiData: {
        startDate: '2020-11-07T17:00:00Z',
        clinicId: '455',
        clinicFriendlyName: null,
        facilityId: '983',
        communityCare: false,
        vdsAppointments: [
          {
            bookingNote: null,
            appointmentLength: '60',
            appointmentTime: '2020-11-07T17:00:00Z',
            clinic: {
              name: 'C&P BEV AUDIO FTC1',
              askForCheckIn: false,
              facilityCode: '983',
            },
            type: 'REGULAR',
            currentStatus: 'NO ACTION TAKEN/TODAY',
          },
        ],
        vvsAppointments: [],
        id: '17dd714287e151195b99164cc1a8e49a',
      },
    },
    vaos: {
      isPastAppointment: false,
      appointmentType: 'vaAppointment',
      videoType: null,
      isCommunityCare: false,
      timeZone: null,
    },
  };
  const facility = {
    id: 'var983',
    name: 'Cheyenne VA Medical Center',
    address: {
      postalCode: '82001-5356',
      city: 'Cheyenne',
      state: 'WY',
      line: ['2360 East Pershing Boulevard'],
    },
    telecom: [
      {
        system: 'phone',
        value: '307-778-7550',
      },
    ],
  };

  let tree;

  beforeEach(() => {
    tree = mount(
      <ConfirmedAppointmentListItem
        appointment={appointment}
        type={APPOINTMENT_TYPES.vaAppointment}
        facility={facility}
      />,
    );
  });

  afterEach(() => {
    tree.unmount();
  });

  it('should have a status of "canceled"', () => {
    expect(
      tree
        .find('span')
        .at(2)
        .text(),
    ).to.contain('Canceled');
  });

  it('should have an h3 with date', () => {
    expect(
      tree
        .find('h3')
        .text()
        .trim(),
    ).to.contain('December 11, 2019');
  });

  it('should display clinic name', () => {
    expect(
      tree
        .find('dt')
        .first()
        .text(),
    ).to.contain('C&P BEV AUDIO FTC1');
  });

  it('should show facility address', () => {
    expect(tree.find('FacilityAddress').exists()).to.be.true;
  });

  it('contain class that breaks long comments', () => {
    expect(tree.find('.vaos-u-word-break--break-word').exists()).to.be.true;
  });
});
