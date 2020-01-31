import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import moment from '../../utils/moment-tz';

import AddToCalendar from '../../components/AddToCalendar';

describe('VAOS <AddToCalendar>', () => {
  const now = new Date();

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
    appointmentTime: now,
    timeZone: '-04:00 EDT',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  };

  const communityCareAppointmentRequest = {
    appointmentTime: now,
    typeOfCareId: 'CC',
    timeZone: '-04:00 EDT',
  };

  const vaAppointmentRequest = {
    optionDate1: ' ',
  };

  const vaAppointment = {
    clinicId: ' ',
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
        `Add to calendar on ${moment(now).format('MMMM D, YYYY')}`,
      );
    });

    tree.unmount();
  });

  describe('Add community care appointment request to calendar', () => {
    const tree = shallow(
      <AddToCalendar
        appointment={communityCareAppointmentRequest}
        facility={facility}
      />,
    );

    const link = tree.find('a');

    it('should render', () => {
      expect(tree.exists()).to.be.true;
    });

    it('should contain valid ICS end command', () => {
      expect(link.props().href).to.contain(encodeURIComponent('END:VCALENDAR'));
    });

    it('should download ICS commands to a file named "Community_Care.ics"', () => {
      expect(link.props().download).to.equal('Community_Care.ics');
    });

    it('should have an aria label', () => {
      expect(link.props()['aria-label']).to.equal(
        `Add to calendar on ${moment(now).format('MMMM D, YYYY')}`,
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
        `Add to calendar on ${moment(now).format('MMMM D, YYYY')}`,
      );
    });

    tree.unmount();
  });

  describe('Add VA appointment request to calendar', () => {
    const tree = shallow(
      <AddToCalendar appointment={vaAppointmentRequest} facility={facility} />,
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
        `Add to calendar on ${moment(now).format('MMMM D, YYYY')}`,
      );
    });

    tree.unmount();
  });

  describe('Add appointment request to calendar in IE', () => {
    const oldValue = window.navigator.msSaveOrOpenBlob;
    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: sinon.spy(),
      writable: true,
    });
    const tree = shallow(
      <AddToCalendar appointment={vaAppointmentRequest} facility={facility} />,
    );

    const button = tree.find('button');

    it('should render', () => {
      expect(button.exists()).to.be.true;
    });

    it('should download ICS file on click', async () => {
      Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
        value: sinon.spy(),
      });
      button.props().onClick();
      const filename = window.navigator.msSaveOrOpenBlob.firstCall.args[1];
      expect(window.navigator.msSaveOrOpenBlob.called).to.be.true;
      expect(filename).to.equal('VA_Appointment.ics');
    });

    it('should have an aria label', () => {
      expect(button.props()['aria-label']).to.equal(
        `Add to calendar on ${moment(now).format('MMMM D, YYYY')}`,
      );
    });

    tree.unmount();
    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: oldValue,
      writable: true,
    });
  });
});
