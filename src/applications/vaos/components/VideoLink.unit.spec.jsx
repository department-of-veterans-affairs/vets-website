import { expect } from 'chai';
import MockDate from 'mockdate';
import React from 'react';

import { format } from 'date-fns';
import {
  createTestStore,
  getTestDate,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import { DATE_FORMATS } from '../utils/constants';
import VideoLink from './VideoLink';

describe('VAOS Component: VideoLink', () => {
  beforeEach(() => {
    MockDate.set(getTestDate());
  });

  afterEach(() => {
    MockDate.reset();
  });

  const initialState = {
    appointments: {
      facilityData: {
        983: {
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

  it('render alert message when it is within timeframe but url is missing ', () => {
    const store = createTestStore(initialState);
    const appointment = {
      location: {
        clinicPhone: '500-500-5000',
        clinicPhoneExtension: '1234',
      },
      start: format(new Date(), DATE_FORMATS.ISODateTime),
      videoData: {
        displayLink: true,
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
      screen.queryByRole('heading', {
        level: 3,
        name: /We.re sorry, we couldn.t load the link to join your appointment/,
      }),
    ).to.exist;
    expect(
      screen.queryByText(
        /Please contact your facility for help joining this appointment/i,
      ),
    ).to.exist;
  });

  it('renders join appointment link when displayLink=true', () => {
    const store = createTestStore(initialState);
    const appointment = {
      location: {},
      videoData: {
        url: 'test.com',
        displayLink: true,
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

  it('does not render join appointment link when displayLink=false', () => {
    const store = createTestStore(initialState);
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      videoData: {
        url: 'test.com',
        displayLink: false,
      },
      vaos: {},
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
        /We.ll add the link to join this appointment on this page 30 minutes before your appointment time/i,
      ),
    ).to.exist;
  });
});
