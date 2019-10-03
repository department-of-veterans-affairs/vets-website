import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';

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

describe('Video visit', () => {
  const apptTime = moment()
    .add(20, 'minutes')
    .format();

  const url =
    'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VVC1012210@care2.evn.va.gov&pin=4790493668#';
  const appointment = {
    startDate: apptTime,
    facilityId: '234',
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
  };

  let tree = shallow(
    <ConfirmedAppointmentListItem appointment={appointment} />,
  );

  it('should contain link to appointment detail page', () => {
    const videoLink = tree.find('.vaos-appts__video-link');
    expect(videoLink.length).to.equal(1);
    expect(videoLink.at(0).props().href).to.equal(url);
  });

  it('should enable video link if appointment if appointment is within 30 minutes', () => {
    expect(tree.find('.usa-button-disabled').length).to.equal(0);
  });

  it('should disable video link if appointment is over 30 min away', () => {
    appointment.startDate = moment()
      .add(40, 'minutes')
      .format();

    tree = shallow(<ConfirmedAppointmentListItem appointment={appointment} />);
    expect(tree.find('.usa-button-disabled').length).to.equal(1);
    tree.unmount();
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
