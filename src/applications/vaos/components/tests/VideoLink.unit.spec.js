import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import MockDate from 'mockdate';
import moment from 'moment-timezone';
import { getTestDate } from '../../tests/mocks/setup';

import VideoLink from '../VideoLink';

beforeEach(() => {
  MockDate.set(getTestDate());
});

afterEach(() => {
  MockDate.reset();
});

describe('VAOS Component: VideoLink', () => {
  it('does not render join appoinment link when not 30 minutes after start time', () => {
    const now = moment();
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: moment.tz(now, 'America/New_York').subtract(600, 'minutes'),
      videoData: {
        url: 'test.com',
      },
    };

    const wrapper = render(<VideoLink appointment={appointment} />);

    expect(wrapper.queryByText('Join appointment')).not.to.exist;
    expect(
      wrapper.queryByText(
        "/We'll add the link to join this appointment 30 minutes before your appointment time/i",
      ),
    );
  });

  it('does not render join appoinment link when not 4 hours after start time', () => {
    const now = moment();
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: moment.tz(now, 'America/New_York').add(600, 'minutes'),
      videoData: {
        url: 'test.com',
      },
    };

    const wrapper = render(<VideoLink appointment={appointment} />);

    expect(wrapper.queryByText('Join appointment')).not.to.exist;
    expect(
      wrapper.queryByText(
        "/We'll add the link to join this appointment 30 minutes before your appointment time/i",
      ),
    );
  });

  it('renders join appoinment link 30 minutes prior to start time', () => {
    const now = moment();
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: moment.tz(now, 'America/New_York').subtract(30, 'minutes'),
      videoData: {
        url: 'test.com',
      },
    };

    const wrapper = render(<VideoLink appointment={appointment} />);
    expect(wrapper.queryByText('Join appointment')).to.exist;
  });

  it('renders join appoinment link 4 hours after start time', () => {
    const now = moment();
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: moment(now).add(240, 'minutes'),
      videoData: {
        url: 'test.com',
      },
    };

    const wrapper = render(<VideoLink appointment={appointment} />);
    expect(wrapper.queryByText('Join appointment')).to.exist;
  });
});
