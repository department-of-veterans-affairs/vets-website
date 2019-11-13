import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';

import VideoVisitLink from '../../components/VideoVisitLink';

describe('Video visit', () => {
  const dateTime = moment()
    .add(20, 'minutes')
    .format();

  const url =
    'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VVC1012210@care2.evn.va.gov&pin=4790493668#';
  const appointment = {
    facilityId: '984',
    clinicId: '456',
    vvsAppointments: [
      {
        patients: [
          {
            virtualMeetingRoom: {
              url,
            },
          },
        ],
        dateTime,
      },
    ],
  };

  // console.log(tree.debug());
  it('should display link button', () => {
    const tree = shallow(<VideoVisitLink appointment={appointment} />);
    expect(tree.exists('.usa-button')).to.equal(true);
    tree.unmount();
  });

  it('should enable video link if appointment if appointment has started and is less than 240 min passed', () => {
    const tree = shallow(<VideoVisitLink appointment={appointment} />);
    expect(tree.exists('.usa-button')).to.equal(true);
    expect(tree.exists('.usa-button-disabled')).to.equal(false);
    tree.unmount();
  });

  it('should enable video link if appointment is less than 30 minutes away', () => {
    const pastAppointment = {
      ...appointment,
      vvsAppointments: [
        {
          patients: [
            {
              virtualMeetingRoom: {
                url,
              },
            },
          ],
          dateTime: moment()
            .add(-20, 'minutes')
            .format(),
        },
      ],
    };

    const tree = shallow(<VideoVisitLink appointment={pastAppointment} />);
    expect(tree.exists('.usa-button')).to.equal(true);
    expect(tree.exists('.usa-button-disabled')).to.equal(false);
    tree.unmount();
  });

  it('should disable video link if appointment is over 4 hours away', () => {
    const futureAppointment = {
      ...appointment,
      vvsAppointments: [
        {
          patients: [
            {
              virtualMeetingRoom: {
                url,
              },
            },
          ],
          dateTime: moment()
            .add(245, 'minutes')
            .format(),
        },
      ],
    };

    const tree = shallow(<VideoVisitLink appointment={futureAppointment} />);
    expect(tree.exists('.usa-button')).to.equal(true);
    expect(tree.exists('.usa-button-disabled')).to.equal(true);
    tree.unmount();
  });

  it('should only display a message if it is a MOBILE_GFE appointment', () => {
    const gfeAppt = {
      ...appointment,
      vvsAppointments: [
        {
          appointmentKind: 'MOBILE_GFE',
        },
      ],
    };
    const tree = shallow(<VideoVisitLink appointment={gfeAppt} />);
    expect(tree.exists('.usa-button')).to.equal(false);
    expect(tree.find('span').text()).to.equal(
      'Join the video session from the device provided by the VA.',
    );
    tree.unmount();
  });
});
