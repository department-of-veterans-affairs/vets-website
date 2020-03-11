import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { getTimezoneBySystemId } from '../../utils/timezone';
import moment from '../../utils/moment-tz.js';

import AddToCalendar from '../../components/AddToCalendar';
import {
  getAppointmentAddress,
  getAppointmentDuration,
  getAppointmentInstructions,
  getAppointmentInstructionsHeader,
  getAppointmentTypeHeader,
  getFacilityAddress,
  getMomentConfirmedDate,
} from '../../utils/appointment';

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
      <AddToCalendar
        summary={getAppointmentTypeHeader(communityCareAppointment)}
        description={`${getAppointmentInstructionsHeader(
          communityCareAppointment,
        )}. ${getAppointmentInstructions(communityCareAppointment)}`}
        location={getAppointmentAddress(communityCareAppointment)}
        duration={getAppointmentDuration(communityCareAppointment)}
        startDateTime={getMomentConfirmedDate(
          communityCareAppointment,
        ).toDate()}
      />,
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
        `Add January 2, 2020 appointment to your calendar`,
      );
    });

    tree.unmount();
  });

  describe('Add VA appointment to calendar', () => {
    const tree = shallow(
      <AddToCalendar
        summary={getAppointmentTypeHeader(vaAppointment)}
        description={`${getAppointmentInstructionsHeader(
          vaAppointment,
        )}. ${getAppointmentInstructions(vaAppointment)}`}
        location={getAppointmentAddress(vaAppointment, facility)}
        duration={getAppointmentDuration(vaAppointment)}
        startDateTime={getMomentConfirmedDate(vaAppointment).toDate()}
      />,
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
        `Add January 2, 2020 appointment to your calendar`,
      );
    });

    tree.unmount();
  });

  describe('Add to calendar direct schedule confirmation page', () => {
    const props = {
      appointmentLength: 20,
      facilityDetails: {
        id: 'vha_983',
        name: 'Cheyenne VA Medical Center',
        address: {
          physical: {
            zip: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            address1: '2360 East Pershing Boulevard',
            address2: null,
            address3: null,
          },
        },
      },
      data: {
        calendarData: {
          selectedDates: [
            {
              dateTime: '2020-03-12T16:40:00',
            },
          ],
        },
      },
      systemId: '983',
    };

    const dateTime = props.data.calendarData.selectedDates[0].dateTime;
    const timezone = getTimezoneBySystemId(props.systemId);
    const momentDate = timezone
      ? moment(dateTime).tz(timezone.timezone, true)
      : moment(dateTime);

    const tree = shallow(
      <AddToCalendar
        summary="VA Appointment"
        description=""
        location={getFacilityAddress(props.facilityDetails)}
        startDateTime={momentDate.toDate()}
        duration={props.appointmentLength}
      />,
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
        `Add March 12, 2020 appointment to your calendar`,
      );
    });
  });

  describe('Add appointment request to calendar in IE', () => {
    const oldValue = window.navigator.msSaveOrOpenBlob;
    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: sinon.spy(),
      writable: true,
    });
    const tree = shallow(
      <AddToCalendar
        summary={getAppointmentTypeHeader(vaAppointment)}
        description={`${getAppointmentInstructionsHeader(
          vaAppointment,
        )}. ${getAppointmentInstructions(vaAppointment)}`}
        location={getAppointmentAddress(vaAppointment, facility)}
        duration={getAppointmentDuration(vaAppointment)}
        startDateTime={getMomentConfirmedDate(vaAppointment).toDate()}
      />,
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
        `Add January 2, 2020 appointment to your calendar`,
      );
    });

    tree.unmount();
    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: oldValue,
      writable: true,
    });
  });
});
