import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';

import VideoVisitLink from '../../components/VideoVisitLink';

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

  let tree = shallow(<VideoVisitLink appointment={appointment} />);

  it('should display link button', () => {
    const linkButton = tree.find('.vaos-appts__video-link');
    expect(linkButton.length).to.equal(1);
  });

  it('should enable video link if appointment if appointment is within 30 minutes', () => {
    const linkButton = tree.find('.usa-button-disabled');
    expect(linkButton.length).to.equal(0);
  });

  it('should disable video link if appointment is over 30 min away', () => {
    appointment.startDate = moment()
      .add(40, 'minutes')
      .format();

    tree = shallow(<VideoVisitLink appointment={appointment} />);
    expect(tree.find('.usa-button-disabled').length).to.equal(1);
    tree.unmount();
  });
});
