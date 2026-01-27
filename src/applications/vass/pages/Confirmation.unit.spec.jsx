import React from 'react';
import { expect } from 'chai';
import { Routes, Route } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import Confirmation from './Confirmation';
import { getDefaultRenderOptions } from '../utils/test-utils';
import { createAppointmentData } from '../utils/appointments';

const appointmentId = '123';
const appointmentData = createAppointmentData({ appointmentId });

// Pre-populate the RTK Query cache with the appointment data
const getVassApiState = () => ({
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
});

describe('VASS Component: Confirmation', () => {
  it('should render all content', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <Routes>
        <Route path="/confirmation/:appointmentId" element={<Confirmation />} />
      </Routes>,
      {
        ...getDefaultRenderOptions({}, { vassApi: getVassApiState() }),
        initialEntries: [`/confirmation/${appointmentId}`],
      },
    );

    expect(getByTestId('confirmation-page')).to.exist;
    expect(getByTestId('confirmation-message')).to.exist;
    expect(getByTestId('appointment-card')).to.exist;
    expect(getByTestId('add-to-calendar-button')).to.exist;
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
          ...getDefaultRenderOptions({}, { vassApi: getVassApiState() }),
          initialEntries: [`/confirmation/${appointmentId}?details=true`],
        },
      );
      expect(getByTestId('confirmation-page')).to.exist;
      expect(queryByTestId('confirmation-message')).to.not.exist;
      expect(getByTestId('appointment-card')).to.exist;
    });
  });
});
