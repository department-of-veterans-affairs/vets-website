import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AddToCalendar from '../../components/AddToCalendar';

describe('VAOS <AddToCalendar>', () => {
  const facility = {
    address: {
      physical: {
        address1: '',
        city: '',
        state: '',
        zip: '',
      },
    },
  };

  const communityCareAppointment = {
    appointmentTime: '01/02/2020 13:45:00',
    timeZone: '-04:00 EDT',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  };

  const vaAppointment = {
    clinicId: ' ',
    startDate: '2020-01-02T16:00:00Z',
    vdsAppointments: [
      {
        appointmentLength: '',
      },
    ],
  };

  describe('Add community care appointment to calendar', () => {
    const tree = shallow(
      <AddToCalendar appointment={communityCareAppointment} facility={{}} />,
    );

    const link = tree.find('a');

    it('should render', () => {
      expect(tree.exists()).to.be.true;
    });

    it('should contain valid ICS begin command', () => {
      expect(link.props().href).to.contain(
        encodeURIComponent('BEGIN:VCALENDAR'),
      );
    });

    it('should contain valid ICS end command', () => {
      expect(link.props().href).to.contain(encodeURIComponent('END:VCALENDAR'));
    });

    it('should download ICS commands to a file named "Community_Care.ics"', () => {
      expect(link.props().download).to.equal('Community_Care.ics');
    });

    it('should have an aria label', () => {
      expect(link.props()['aria-label']).to.equal(
        `Add to calendar on January 2, 2020`,
      );
    });

    tree.unmount();
  });

  describe('Add VA appointment to calendar', () => {
    const tree = shallow(
      <AddToCalendar appointment={vaAppointment} facility={facility} />,
    );

    const link = tree.find('a');

    it('should render', () => {
      expect(tree.exists()).to.be.true;
    });

    it('should contain valid ICS end command', () => {
      expect(link.props().href).to.contain(encodeURIComponent('END:VCALENDAR'));
    });

    it('should download ICS commands to a file named "VA_Appointment.ics"', () => {
      expect(link.props().download).to.equal('VA_Appointment.ics');
    });

    it('should have an aria label', () => {
      expect(link.props()['aria-label']).to.equal(
        `Add to calendar on January 2, 2020`,
      );
    });

    tree.unmount();
  });
});
