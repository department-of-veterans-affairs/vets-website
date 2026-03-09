import React from 'react';
import sinon from 'sinon';
import { format, parseISO } from 'date-fns';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import * as recordEvent from '~/platform/monitoring/record-event';

import { AppointmentCard } from '../../../components/health-care/AppointmentCard';

describe('<AppointmentCard />', () => {
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

  it('should render with appointment', () => {
    const appointment = {
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
    };

    const startFns = parseISO(appointment.localStartTime);
    const startFormatted = format(startFns, 'eeee, MMMM d, yyyy');
    const tree = renderInReduxProvider(
      <AppointmentCard appointment={appointment} />,
      {
        ...initialState,
        health: {
          appointments: { appointments: [appointment] },
        },
      },
    );

    tree.getByTestId('health-care-appointments-card');
    tree.getByText('Upcoming appointment');
    const link = tree.container.querySelector(
      'va-link[href="/my-health/appointments/123"][text="Manage this appointment"]',
    );
    tree.getByText('VA Video Connect yada yada yada');
    tree.getByText(startFormatted);
    tree.getByText(`Time: 7:30 a.m. MT`);
    link.click();
    expect(recordEventStub.called).to.be.true;
  });

  context('renders the location name', () => {
    it('when the appointment is a video appointment without additionalInfo', () => {
      const appointment = {
        id: '123',
        localStartTime: '2023-12-04T10:00:00-05:00',
        isVideo: true,
      };

      const tree = renderInReduxProvider(
        <AppointmentCard appointment={appointment} />,
        {
          ...initialState,
          health: {
            appointments: { appointments: [appointment] },
          },
        },
      );

      tree.getByText('VA Video Connect');
    });

    it('when the appointment is a video appointment with additionalInfo', () => {
      const appointment = {
        id: '123',
        localStartTime: '2023-12-04T10:00:00-05:00',
        isVideo: true,
        additionalInfo: 'testing',
      };

      const tree = renderInReduxProvider(
        <AppointmentCard appointment={appointment} />,
        {
          ...initialState,
          health: {
            appointments: { appointments: [appointment] },
          },
        },
      );

      tree.getByText('VA Video Connect testing');

      expect(
        tree.container.querySelector(
          'va-link[href="/my-health/appointments/123"][text="Manage this appointment"]',
        ),
      ).to.exist;
    });

    it("when the appointment isn't a video appointment", () => {
      const providerName = 'test provider';
      const appointment = {
        id: '123',
        localStartTime: '2023-12-04T10:00:00-05:00',
        isVideo: false,
        providerName,
      };
      const tree = renderInReduxProvider(
        <AppointmentCard appointment={appointment} />,
        {
          ...initialState,
          health: {
            appointments: { appointments: [appointment] },
          },
        },
      );

      tree.getByText(providerName);
      expect(
        tree.container.querySelector(
          'va-link[href="/my-health/appointments/123"][text="Manage this appointment"]',
        ),
      ).to.exist;
    });
  });
});
