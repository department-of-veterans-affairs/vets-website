import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';

import ConfirmedAppointmentListItem from '../../components/ConfirmedAppointmentListItem';

describe('VAOS <ConfirmedAppointmentListItem> Regular Appointment', () => {
  const appointment = {
    appointmentType: 'Testing',
    startDate: '2019-12-11T16:00:00Z',
    facilityId: '983',
    clinicId: '123',
    vvsAppointments: [],
    vdsAppointments: [
      {
        appointmentLength: '60',
        appointmentTime: '2019-12-11T16:00:00Z',
        clinic: {
          name: 'C&P BEV AUDIO FTC1',
          askForCheckIn: false,
          facilityCode: '983',
        },
        patientId: '7216691',
        type: 'REGULAR',
        currentStatus: 'NO ACTION TAKEN/TODAY',
        bookingNote: 'Booking note',
      },
    ],
  };
  const facility = {
    address: {
      mailing: {},
      physical: {
        zip: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        address1: '2360 East Pershing Boulevard',
        address2: null,
        address3: null,
      },
    },
    phone: {
      main: '307-778-7550',
    },
  };

  let tree;

  beforeEach(() => {
    tree = shallow(
      <ConfirmedAppointmentListItem
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

  it('should have an h2 with date', () => {
    expect(
      tree
        .find('h2')
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

  it('should not show booking note', () => {
    expect(tree.text()).not.to.contain('Booking note');
  });
});

describe('VAOS <ConfirmedAppointmentListItem> Community Care Appointment', () => {
  const appointment = {
    appointmentRequestId: 'guid',
    appointmentTime: '05/22/2019 10:00:00',
    providerPractice: 'My Clinic',
    timeZone: 'UTC',
    address: {
      street: '123 second st',
      city: 'Northampton',
      state: 'MA',
      zipCode: '22222',
    },
  };

  const tree = shallow(
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

  it('should have an h2 with date', () => {
    expect(
      tree
        .find('h2')
        .text()
        .trim(),
    ).to.contain('May 22, 2019 at 10:00 a.m.');
  });

  it('should display clinic name', () => {
    expect(tree.find('dt').text()).to.contain('My Clinic');
  });

  it('should display clinic address', () => {
    expect(tree.find('dd').text()).to.contain(
      '123 second stNorthampton, MA 22222',
    );
  });
});

describe('VAOS <ConfirmedAppointmentListItem> Video Appointment', () => {
  const apptTime = moment()
    .add(20, 'minutes')
    .format();

  const url =
    'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VVC1012210@care2.evn.va.gov&pin=4790493668#';
  const appointment = {
    startDate: apptTime,
    facilityId: '984',
    clinicId: '456',
    vvsAppointments: [
      {
        bookingNotes: 'My reason isn’t listed: Booking note',
        patients: {
          patient: [
            {
              virtualMeetingRoom: {
                url,
              },
            },
          ],
        },
      },
    ],
    vdsAppointments: [],
  };

  const tree = shallow(
    <ConfirmedAppointmentListItem appointment={appointment} />,
  );

  it('should contain link to video conference', () => {
    expect(tree.find('VideoVisitSection').length).to.equal(1);
  });

  it('should show booking note', () => {
    expect(tree.text()).to.contain('Booking note');
    expect(tree.text()).to.contain('My reason isn’t listed');
  });
});
