import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import { VIDEO_TYPES, APPOINTMENT_TYPES } from '../../utils/constants';

import VideoVisitSection from '../../components/VideoVisitSection';

describe('Video visit', () => {
  const dateTime = moment().add(20, 'minutes');

  const appointment = {
    resourceType: 'Appointment',
    id: '123',
    status: 'booked',
    description: 'FUTURE',
    start: dateTime,
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
              start: dateTime,
            },
          },
        ],
      },
    ],
    legacyVAR: {
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
      videoType: 'videoConnect',
      isCommunityCare: false,
      timeZone: null,
    },
  };

  it('should display link button', () => {
    const tree = shallow(<VideoVisitSection appointment={appointment} />);
    expect(tree.exists('.usa-button')).to.equal(true);
    tree.unmount();
  });

  it('should enable video link if appointment if appointment has started and is less than 240 min passed', () => {
    const tree = shallow(<VideoVisitSection appointment={appointment} />);
    expect(tree.exists('.usa-button')).to.equal(true);
    expect(tree.exists('.usa-button-disabled')).to.equal(false);
    tree.unmount();
  });

  it('should enable video link if appointment is less than 30 minutes away', () => {
    const pastAppointment = {
      ...appointment,
      start: moment().add(20, 'minutes'),
    };

    const tree = shallow(<VideoVisitSection appointment={pastAppointment} />);
    const link = tree.find('.usa-button');
    expect(link.length).to.equal(1);
    expect(link.props()['aria-describedby']).to.equal(undefined);
    expect(link.props()['aria-disabled']).to.equal('false');
    expect(tree.exists('span')).to.equal(false);
    expect(tree.exists('.usa-button-disabled')).to.equal(false);
    tree.unmount();
  });

  it('should disable video link if appointment is more than 30 minutes away', () => {
    const futureAppointment = {
      ...appointment,
      start: moment().add(32, 'minutes'),
    };

    const tree = shallow(<VideoVisitSection appointment={futureAppointment} />);
    expect(tree.exists('.usa-button')).to.equal(true);
    expect(tree.exists('.usa-button-disabled')).to.equal(true);

    const describedById = 'description-join-link-123';
    const link = tree.find('.usa-button');
    expect(link.props()['aria-describedby']).to.equal(describedById);
    expect(link.props()['aria-disabled']).to.equal('true');
    expect(tree.exists(`span#${describedById}`)).to.be.true;
    tree.unmount();
  });

  it('should disable video link if appointment is over 4 hours in the past', () => {
    const futureAppointment = {
      ...appointment,
      start: moment().add(-245, 'minutes'),
    };

    const tree = shallow(<VideoVisitSection appointment={futureAppointment} />);
    expect(tree.exists('.usa-button')).to.equal(true);
    expect(tree.exists('.usa-button-disabled')).to.equal(true);

    const describedById = 'description-join-link-123';
    const link = tree.find('.usa-button');
    expect(link.props()['aria-describedby']).to.equal(describedById);
    expect(link.props()['aria-disabled']).to.equal('true');
    expect(tree.exists(`span#${describedById}`)).to.be.true;
    tree.unmount();
  });

  it('should only display a message if it is a MOBILE_GFE appointment', () => {
    const gfeAppt = {
      ...appointment,
      vaos: { ...appointment.vaos, videoType: VIDEO_TYPES.gfe },
    };
    const tree = shallow(<VideoVisitSection appointment={gfeAppt} />);
    expect(tree.exists('.usa-button')).to.equal(false);
    expect(tree.find('span').text()).to.equal(
      'Join the video session from the device provided by the VA.',
    );
    tree.unmount();
  });
});
