import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ConfirmedAppointment, {
  formatDate,
  formatTimeFromDate,
} from '../../components/ConfirmedAppointment';

describe('VA Confirmed Appointment', () => {
  const appointment = {
    appointmentType: 'Testing',
    optionDate1: '05/22/2019',
    optionTime1: 'PM',
    typeOfCareId: '1',
    friendlyLocationName: 'Some location',
    facility: {
      city: 'Northampton',
      state: 'MA',
    },
    appointmentRequestId: 'guid',
    patient: {
      firstName: 'Joe',
      lastName: 'Blow',
    },
    status: 'Booked',
    bookedApptDateTime: '09/11/2019 10:00:00',
  };
  let tree;
  // let tree = shallow(<ConfirmedAppointment appointment={appointment} />);

  before(() => { });

  after(() => { });

  describe('appointment details', () => {
    beforeEach(() => {
      appointment.friendlyLocationName = 'Some location';
      tree = shallow(<ConfirmedAppointment appointment={appointment} />);
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should not contain community care data', () => {
      expect(appointment.ccAppointmentRequest).to.be.undefined;
    });

    it('should not display prefered location', () => {
      expect(
        tree
          .find('h3')
          .at(1)
          .text(),
      ).to.equal('Where');
    });

    it('should render name', () => {
      expect(
        tree
          .find('h2')
          .text()
          .trim(),
      ).to.equal(
        `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      );
    });

    it('should render friendly location name....', () => {
      expect(
        tree
          .find('li > div > div')
          .at(1)
          .text(),
      ).to.contain(appointment.friendlyLocationName);
    });

    it('should render facility name if friendly location name is not present....', () => {
      appointment.friendlyLocationName = null;
      tree = shallow(<ConfirmedAppointment appointment={appointment} />);
      expect(
        tree
          .find('li > div > div')
          .at(1)
          .text(),
      ).to.contain(appointment.facility.city);
      tree.unmount();
    });

    it('should render booked appointment date', () => {
      expect(
        tree
          .find('ul > li')
          .at(0)
          .text(),
      ).to.equal(formatDate(appointment.bookedApptDateTime));
    });

    it('should render booked appointment time', () => {
      expect(
        tree
          .find('ul > li')
          .at(1)
          .text(),
      ).to.equal(formatTimeFromDate(appointment.bookedApptDateTime));
    });

    it('should contain link to appointment detail page', () => {
      expect(tree.find('Link').props().to).to.equal(
        `appointments/confirmed/${appointment.appointmentRequestId}`,
      );
    });
  });
});

describe('Community Care Confirmed Appointment', () => {
  const appointment = {
    appointmentType: 'Testing',
    optionDate1: '05/22/2019',
    optionTime1: 'PM',
    typeOfCareId: 'CCTest',
    friendlyLocationName: 'Some location',
    facility: {
      city: 'Northampton',
      state: 'MA',
    },
    ccAppointmentRequest: {
      preferredCity: 'Leeds',
      preferredState: 'NH',
    },
    patient: {
      firstName: 'Joe',
      lastName: 'Blow',
    },
    status: 'Booked',
  };

  const tree = shallow(<ConfirmedAppointment appointment={appointment} />);

  describe('appointment details', () => {
    it('should contain community care data', () => {
      expect(appointment.ccAppointmentRequest).not.to.be.undefined;
    });

    it('should display preferred location header', () => {
      expect(
        tree
          .find('h3')
          .at(1)
          .text(),
      ).to.contain('Preferred location:');
    });

    it('should display preferred location', () => {
      const locationDiv = tree.find('li > div > div').at(1);

      expect(locationDiv.text()).to.contain('Preferred location:');
      expect(locationDiv.text()).to.contain('Leeds, NH');
    });

    // TODO: Probably need the same CC checked for 'When' section since CC appointments don't have a booked data.
    xit('should display preferred location', () => {
      expect(
        tree
          .find('ul > li')
          .at(0)
          .text()
          .trim(),
      ).to.equal('May 22, 2019 in the afternoon');
    });
  });
});
