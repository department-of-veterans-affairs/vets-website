import React from 'react';
import sinon from 'sinon';
import { format, parseISO } from 'date-fns';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import * as recordEvent from '~/platform/monitoring/record-event';

import { AppointmentsCard } from '../../../components/health-care/AppointmentsCardLegacy';

describe('<AppointmentsCardLegacy />', () => {
  let sandbox;
  let recordEventStub;
  const initialState = {
    user: {},
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    recordEventStub = sandbox.stub(recordEvent, 'default').callsFake(() => {});
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render with appointments', () => {
    const appointments = [
      {
        id: '123',
        additionalInfo: 'yada yada yada',
        isVideo: true,
        providerName: 'test provider',
        location: {
          attributes: {
            id: '668QB',
            timezone: {
              timeZoneId: 'America/Denver',
            },
          },
        },
        localStartTime: '2024-08-11T06:30:00-07:00',
        type: 'regular',
      },
    ];

    const startFns = parseISO(appointments[0].localStartTime);
    const startFormatted = format(startFns, 'eeee, MMMM d, yyyy');
    const tree = renderInReduxProvider(
      <AppointmentsCard appointments={appointments} />,
      {
        ...initialState,
        health: {
          appointments: { appointments },
        },
      },
    );

    tree.getByTestId('health-care-appointments-card');
    tree.getByText('Next appointment');
    tree.getByText('Schedule and manage your appointments');
    const link = tree.getByRole('link', {
      name: /schedule and manage your appointments/i,
      value: {
        text: '/my-health/appointments',
      },
    });
    tree.getByText('VA Video Connect yada yada yada');
    tree.getByText(startFormatted);
    tree.getByText(`Time: 7:30 a.m. MT`);
    link.click();
    expect(recordEventStub.called).to.be.true;
  });

  context('renders the location name', () => {
    it('when the appointment is a video appointment without additionalInfo', () => {
      const appointments = [
        {
          localStartTime: '2023-12-04T10:00:00-05:00',
          isVideo: true,
        },
      ];

      const tree = renderInReduxProvider(
        <AppointmentsCard appointments={appointments} />,
        {
          ...initialState,
          health: {
            appointments: { appointments },
          },
        },
      );

      tree.getByText('VA Video Connect');
    });

    it('when the appointment is a video appointment with additionalInfo', () => {
      const appointments = [
        {
          localStartTime: '2023-12-04T10:00:00-05:00',
          isVideo: true,
          additionalInfo: 'testing',
        },
      ];

      const tree = renderInReduxProvider(
        <AppointmentsCard appointments={appointments} />,
        {
          ...initialState,
          health: {
            appointments: { appointments },
          },
        },
      );

      tree.getByText('VA Video Connect testing');

      expect(
        tree.getByRole('link', {
          name: /schedule and manage your appointments/i,
          value: {
            text: '/my-health/appointments',
          },
        }),
      ).to.exist;
    });

    it("when the appointment isn't a video appointment", () => {
      const providerName = 'test provider';
      const appointments = [
        {
          localStartTime: '2023-12-04T10:00:00-05:00',
          isVideo: false,
          providerName,
        },
      ];
      const tree = renderInReduxProvider(
        <AppointmentsCard appointments={appointments} />,
        {
          ...initialState,
          health: {
            appointments: { appointments },
          },
        },
      );

      tree.getByText(providerName);
      tree.getByRole('link', {
        name: /schedule and manage your appointments/i,
        value: {
          text: '/my-health/appointments',
        },
      });
    });
  });
});
