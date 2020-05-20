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
    status: APPOINTMENT_STATUS.booked,
    appointmentDate: moment('2019-12-11T16:00:00Z'),
    facilityId: '983',
    clinicId: '123',
    duration: 60,
    clinicName: 'C&P BEV AUDIO FTC1',
    instructions: 'Follow-up/Routine: Instructions',
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
    id: 'guid',
    appointmentType: APPOINTMENT_TYPES.ccAppointment,
    isCommunityCare: true,
    status: APPOINTMENT_STATUS.booked,
    appointmentDate: moment('05/22/2019 10:00:00', 'MM/DD/YYYY HH:mm:ss'),
    providerPractice: 'My Clinic',
    timeZone: 'UTC',
    instructions: 'Instruction text',
    address: {
      street: '123 second st',
      city: 'Northampton',
      state: 'MA',
      zipCode: '22222',
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
});

describe('VAOS <ConfirmedAppointmentListItem> Video Appointment', () => {
  const apptTime = moment().add(20, 'minutes');

  const url =
    'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VVC1012210@care2.evn.va.gov&pin=4790493668#';
  const appointment = {
    appointmentType: APPOINTMENT_TYPES.vaAppointment,
    videoType: VIDEO_TYPES.videoConnect,
    appointmentDate: apptTime,
    facilityId: '984',
    clinicId: '456',
    videoLink: url,
    status: APPOINTMENT_STATUS.booked,
    instructions: 'My reason isn’t listed: Booking note',
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
    appointmentDate: moment('2019-12-11T16:00:00Z'),
    status: APPOINTMENT_STATUS.cancelled,
    facilityId: '983',
    clinicId: '123',
    clinicName: 'C&P BEV AUDIO FTC1',
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
