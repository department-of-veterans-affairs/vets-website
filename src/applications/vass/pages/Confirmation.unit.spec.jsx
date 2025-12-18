import React from 'react';
import { expect } from 'chai';
import { Routes, Route } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import Confirmation from './Confirmation';
import reducers from '../redux/reducers';
import { vassApi } from '../redux/api/vassApi';

describe('VASS Component: Confirmation', () => {
  it('should render all content', () => {
    const appointmentId = '123';
    const appointmentData = {
      appointmentId,
      phoneNumber: '8005551212',
      dtStartUtc: '2025-05-01T16:00:00.000Z',
      typeOfCare: 'Solid Start',
      providerName: 'Bill Brasky',
      topics: [{ topicName: 'Benefits' }],
    };

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
});
