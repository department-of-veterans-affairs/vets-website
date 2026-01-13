import React from 'react';
import { expect } from 'chai';
import { Routes, Route } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import Confirmation from './Confirmation';
import reducers from '../redux/reducers';
import { vassApi } from '../redux/api/vassApi';

const appointmentId = '123';
const appointmentData = {
  appointmentId,
  startUTC: '2025-05-01T16:00:00.000Z',
  endUTC: '2025-05-01T16:30:00.000Z',
  agentId: '353dd0fc-335b-ef11-bfe3-001dd80a9f48',
  agentNickname: 'Bill Brasky',
  appointmentStatusCode: 1,
  appointmentStatus: 'Confirmed',
  cohortStartUtc: '2025-01-01T00:00:00.000Z',
  cohortEndUtc: '2025-12-31T23:59:59.999Z',
};

describe('VASS Component: Confirmation', () => {
  it('should render all content', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <Routes>
        <Route path="/confirmation/:appointmentId" element={<Confirmation />} />
      </Routes>,
      {
        initialEntries: [`/confirmation/${appointmentId}`],
        initialState: {
          vassApi: {
            queries: {
              [`getAppointment({"appointmentId":"${appointmentId}"})`]: {
                status: 'fulfilled',
                endpointName: 'getAppointment',
                requestId: 'test',
                startedTimeStamp: 0,
                data: appointmentData,
              },
            },
            mutations: {},
            provided: {},
            subscriptions: {},
            config: {
              online: true,
              focused: true,
              middlewareRegistered: true,
            },
          },
        },
        reducers,
        additionalMiddlewares: [vassApi.middleware],
      },
    );

    expect(getByTestId('confirmation-page')).to.exist;
    expect(getByTestId('confirmation-message')).to.exist;
    expect(getByTestId('appointment-card')).to.exist;
  });

  describe('when the details url parameter is true', () => {
    it('should only display the appointment card', () => {
      const { getByTestId, queryByTestId } = renderWithStoreAndRouter(
        <Routes>
          <Route
            path="/confirmation/:appointmentId"
            element={<Confirmation />}
          />
        </Routes>,
        {
          initialEntries: [`/confirmation/${appointmentId}?details=true`],
          initialState: {
            vassApi: {
              queries: {
                [`getAppointment({"appointmentId":"${appointmentId}"})`]: {
                  status: 'fulfilled',
                  endpointName: 'getAppointment',
                  requestId: 'test',
                  startedTimeStamp: 0,
                  data: appointmentData,
                },
              },
              mutations: {},
              provided: {},
              subscriptions: {},
              config: {
                online: true,
                focused: true,
                middlewareRegistered: true,
              },
            },
          },
          reducers,
          additionalMiddlewares: [vassApi.middleware],
        },
      );
      expect(getByTestId('confirmation-page')).to.exist;
      expect(queryByTestId('confirmation-message')).to.not.exist;
      expect(getByTestId('appointment-card')).to.exist;
    });
  });
});
