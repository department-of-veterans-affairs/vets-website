import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ConfirmedAppointmentListItem from '../../components/ConfirmedAppointmentListItem';

describe('VA Confirmed Appointment', () => {
  const appointment = {
    startDate: '2019-04-05T10:00:00',
    facilityId: '234',
    clinicId: '456',
    vdsAppointments: [
      {
        clinic: {
          name: 'Some location',
        },
      },
    ],
  };
  let tree;

  describe('appointment details', () => {
    beforeEach(() => {
      tree = shallow(
        <ConfirmedAppointmentListItem appointment={appointment} />,
      );
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
          .text()
          .trim(),
      ).to.equal('Where');
    });

    it('should render facility info link', () => {
      expect(tree.find('a').props().href).to.contain(appointment.facilityId);
      tree.unmount();
    });

    it('should render booked appointment date', () => {
      expect(
        tree
          .find('ul > li')
          .at(0)
          .text(),
      ).to.equal('April 5, 2019');
    });

    it('should render booked appointment time', () => {
      expect(
        tree
          .find('ul > li')
          .at(1)
          .text(),
      ).to.equal('10:00 a.m.');
    });

    it('should contain link to appointment detail page', () => {
      expect(tree.find('Link').props().to).to.equal(
        `appointments/confirmed/va-234-456-2019-04-05T10:00:00`,
      );
    });
  });
});

describe('Community Care Confirmed Appointment', () => {
  const appointment = {
    appointmentRequestId: 'guid',
    appointmentTime: '05/22/2019 10:00:00',
    providerPractice: '',
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

  describe('appointment details', () => {
    it('should display location', () => {
      const locationDiv = tree.find('li > div > div').at(1);

      expect(locationDiv.text()).to.contain(
        '123 second stNorthampton, MA 22222',
      );
    });

    it('should display booked time', () => {
      expect(
        tree
          .find('ul')
          .text()
          .trim(),
      ).to.equal('May 22, 201910:00 a.m.');
    });
  });
});
