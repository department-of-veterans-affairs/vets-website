import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
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
              name: 'CHY OPT VAR1',
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

  let tree;

  beforeEach(() => {
    tree = mount(
      <ConfirmedAppointmentListItem
        showCancelButton
        cancelAppointment={cancelAppointment}
        appointment={appointment}
        facility={facility}
      />,
    );
  });

  afterEach(() => {
    tree.unmount();
  });

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
    ).to.contain('December 11, 2019');
  });

  it('should display clinic name', () => {
    expect(tree.text()).to.contain('C&P BEV AUDIO FTC1');
  });

  it('should show facility address', () => {
    expect(tree.find('FacilityAddress').exists()).to.be.true;
  });

  it('should show instructions', () => {
    expect(tree.text()).to.contain('Follow-up/Routine');
    expect(tree.text()).to.contain('Instructions');
  });

  it('should show cancel link', () => {
    expect(tree.text()).to.contain('Cancel appointment');
  });

  it('should cancel appointment', () => {
    tree
      .find('button')
      .props()
      .onClick();
    expect(cancelAppointment.called).to.be.true;
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
    legacyVAR: {
      id: '8a4885896a22f88f016a2cb7f5de0062',
    },
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
    comment: 'T+90 Testing',
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
      id: '05760f00c80ae60ce49879cf37a05fc8',
      apiData: {
        startDate: '2020-11-25T15:17:00Z',
        clinicId: null,
        clinicFriendlyName: null,
        facilityId: '983',
        communityCare: false,
        vdsAppointments: [],
        vvsAppointments: [
          {
            id: '8a74bdfa-0e66-4848-87f5-0d9bb413ae6d',
            appointmentKind: 'ADHOC',
            sourceSystem: 'SM',
            dateTime: '2020-11-25T15:17:00Z',
            duration: 20,
            status: {
              description: 'F',
              code: 'FUTURE',
            },
            schedulingRequestType: 'NEXT_AVAILABLE_APPT',
            type: 'REGULAR',
            bookingNotes: 'T+90 Testing',
            instructionsOther: false,
            patients: [
              {
                name: {
                  firstName: 'JUDY',
                  lastName: 'MORRISON',
                },
                contactInformation: {
                  mobile: '7036520000',
                  preferredEmail: 'marcy.nadeau@va.gov',
                },
                location: {
                  type: 'NonVA',
                  facility: {
                    name: 'CHEYENNE VAMC',
                    siteCode: '983',
                    timeZone: '10',
                  },
                },
                patientAppointment: true,
                virtualMeetingRoom: {
                  conference: 'VVC8275247',
                  pin: '3242949390#',
                  url:
                    'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=3242949390#',
                },
              },
            ],
            providers: [
              {
                name: {
                  firstName: 'Test T+90',
                  lastName: 'Test',
                },
                contactInformation: {
                  mobile: '8888888888',
                  preferredEmail: 'marcy.nadeau@va.gov',
                  timeZone: '10',
                },
                location: {
                  type: 'VA',
                  facility: {
                    name: 'CHEYENNE VAMC',
                    siteCode: '983',
                    timeZone: '10',
                  },
                },
                virtualMeetingRoom: {
                  conference: 'VVC8275247',
                  pin: '7172705#',
                  url:
                    'https://care2.evn.va.gov/vvc-app/?name=Test%2CTest+T%2B90&join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=7172705#',
                },
              },
            ],
          },
        ],
        id: '05760f00c80ae60ce49879cf37a05fc8',
      },
    },
    vaos: {
      isPastAppointment: false,
      appointmentType: APPOINTMENT_TYPES.vaAppointment,
      videoType: VIDEO_TYPES.videoConnect,
      isCommunityCare: false,
      timeZone: null,
    },
  };

  const tree = mount(
    <ConfirmedAppointmentListItem appointment={appointment} />,
  );

  it('should contain link to video conference', () => {
    expect(tree.find('VideoVisitSection').length).to.equal(1);
  });

  it('should not show booking note', () => {
    expect(tree.text()).not.to.contain('Booking note');
    expect(tree.text()).not.to.contain('My reason isn’t listed');
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
