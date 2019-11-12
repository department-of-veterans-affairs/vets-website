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
        bookingNote: 'Test',
      },
    ],
  };

  let tree;

  beforeEach(() => {
    tree = shallow(<ConfirmedAppointmentListItem appointment={appointment} />);
  });

  afterEach(() => {
    tree.unmount();
  });

  it('should have a status of "confirmed"', () => {
    expect(
      tree
        .find('.vaos-appts__status span')
        .at(0)
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
    expect(tree.find('.vaos-appts__split-section dt').text()).to.contain(
      'C&P BEV AUDIO FTC1',
    );
  });

  it('should have a link to facility info', () => {
    expect(tree.find('.vaos-appts__split-section a').text()).to.contain(
      'View facility information',
    );
  });
});

describe('VAOS <ConfirmedAppointmentListItem> Community Care Appointment', () => {
  const appointment = {
    appointmentRequestId: 'guid',
    appointmentTime: '05/22/2019 10:00:00',
    providerPractice: 'My Clinic',
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
        .find('.vaos-appts__status span')
        .at(0)
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
    expect(tree.find('.vaos-appts__split-section dt').text()).to.contain(
      'My Clinic',
    );
  });

  it('should display clinic address', () => {
    expect(tree.find('.vaos-appts__split-section dd').text()).to.contain(
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
    expect(tree.find('VideoVisitLink').length).to.equal(1);
  });
});
