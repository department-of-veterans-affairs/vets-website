import React from 'react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import moment from 'moment-timezone';
import {
  getTestDate,
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';

import VideoLink from '../VideoLink';

beforeEach(() => {
  MockDate.set(getTestDate());
});

afterEach(() => {
  MockDate.reset();
});

describe('VAOS Component: VideoLink', () => {
  const initialState = {
    appointments: {
      facilityData: {
        '983': {
          address: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
          name: 'Cheyenne VA Medical Center',
          telecom: [
            {
              system: 'phone',
              value: '307-778-7550',
            },
          ],
        },
      },
    },
  };

  it('does not render join appointment link when more than 30 minutes before start time', () => {
    const now = moment();
    const store = createTestStore(initialState);
    const appointment = {
      location: {
        clinicPhone: '500-500-5000',
        clinicPhoneExtension: '1234',
      },
      start: moment.tz(now, 'America/New_York').subtract(600, 'minutes'),
      videoData: {
        url: 'test.com',
      },
      vaos: {
        isVideo: true,
      },
    };
    const screen = renderWithStoreAndRouter(
      <VideoLink appointment={appointment} />,
      {
        store,
      },
    );
    expect(screen.queryByText('Join appointment')).not.to.exist;
    expect(
      screen.queryByText(
        /We'll add the link to join this appointment 30 minutes before your appointment time/i,
      ),
    ).to.exist;
  });

  it('does not render join appointment link when beyond 4 hours after start time', () => {
    const now = moment();
    const store = createTestStore(initialState);
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: moment.tz(now, 'America/New_York').add(600, 'minutes'),
      videoData: {
        url: 'test.com',
      },
      vaos: {
        isVideo: true,
      },
    };

    const screen = renderWithStoreAndRouter(
      <VideoLink appointment={appointment} />,
      {
        store,
      },
    );
    expect(screen.queryByText('Join appointment')).not.to.exist;
    expect(
      screen.queryByText(
        /We'll add the link to join this appointment 30 minutes before your appointment time/i,
      ),
    ).to.exist;
  });

  it('render alert message when it is within timeframe but url is missing ', () => {
    const now = moment();
    const store = createTestStore(initialState);
    const appointment = {
      location: {
        clinicPhone: '500-500-5000',
        clinicPhoneExtension: '1234',
      },
      start: moment.tz(now, 'America/New_York').subtract(30, 'minutes'),
      videoData: {},
      vaos: {
        isVideo: true,
      },
    };

    const screen = renderWithStoreAndRouter(
      <VideoLink appointment={appointment} />,
      {
        store,
      },
    );
    expect(screen.queryByText('Join appointment')).not.to.exist;
    expect(
      screen.queryByRole('heading', {
        level: 2,
        name: /We're sorry, we couldn't load the link to join your appointment/,
      }),
    ).to.exist;
    expect(
      screen.queryByText(
        /Please contact your facility for help joining this appointment/i,
      ),
    ).to.exist;
  });

  it('renders join appointment link 30 minutes prior to start time', () => {
    const now = moment();
    const store = createTestStore(initialState);
    const appointment = {
      location: {},
      start: moment.tz(now, 'America/Los_Angeles').subtract(30, 'minutes'),
      videoData: {
        url: 'test.com',
      },
      vaos: {},
    };
    const screen = renderWithStoreAndRouter(
      <VideoLink appointment={appointment} />,
      {
        store,
      },
    );
    expect(screen.queryByText('Join appointment')).to.exist;
  });

  it('renders join appointment link within 4 hours after start time', () => {
    const now = moment();
    const store = createTestStore(initialState);
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: moment.tz(now, 'America/Los_Angeles').add(90, 'minutes'),
      videoData: {
        url: 'test.com',
      },
      vaos: {},
    };
    const screen = renderWithStoreAndRouter(
      <VideoLink appointment={appointment} />,
      {
        store,
      },
    );
    expect(screen.queryByText('Join appointment')).to.exist;
  });
});
