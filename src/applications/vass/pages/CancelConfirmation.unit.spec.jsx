import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import CancelConfirmation from './CancelConfirmation';
import { getDefaultRenderOptions } from '../utils/test-utils';
import {
  createAppointmentData,
  createVassApiStateWithAppointment,
} from '../utils/appointments';
import * as authUtils from '../utils/auth';
import { URLS } from '../utils/constants';
import {
  createServiceError,
  createAppointmentNotFoundError,
} from '../services/mocks/utils/errors';

const appointmentId = 'abcdef123456';
const appointmentData = createAppointmentData({ appointmentId });

const getVassApiState = () =>
  createVassApiStateWithAppointment(appointmentId, appointmentData);

describe('VASS Component: CancelConfirmation', () => {
  it('renders page, message, and appointment card', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <Routes>
        <Route
          path={`${URLS.CANCEL_APPOINTMENT_CONFIRMATION}/:appointmentId`}
          element={<CancelConfirmation />}
        />
      </Routes>,
      {
        ...getDefaultRenderOptions({}, { vassApi: getVassApiState() }),
        initialEntries: [
          `${URLS.CANCEL_APPOINTMENT_CONFIRMATION}/${appointmentId}`,
        ],
      },
    );
    expect(getByTestId('cancel-confirmation-page')).to.exist;
    expect(getByTestId('cancel-confirmation-message').textContent).to.match(
      /If you need to reschedule, call us at.*/i,
    );
    expect(getByTestId('cancel-confirmation-phone')).to.exist;
    expect(getByTestId('appointment-card')).to.exist;
  });

  describe('API error handling', () => {
    let getVassTokenStub;

    beforeEach(() => {
      mockFetch();
      getVassTokenStub = sinon
        .stub(authUtils, 'getVassToken')
        .returns('mock-token');
    });

    afterEach(() => {
      resetFetch();
      getVassTokenStub.restore();
    });

    it('should display error alert when getAppointment returns a server error', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), createServiceError());

      const { getByTestId, queryByTestId } = renderWithStoreAndRouter(
        <Routes>
          <Route
            path={`${URLS.CANCEL_APPOINTMENT_CONFIRMATION}/:appointmentId`}
            element={<CancelConfirmation />}
          />
        </Routes>,
        {
          ...getDefaultRenderOptions(),
          initialEntries: [
            `${URLS.CANCEL_APPOINTMENT_CONFIRMATION}/${appointmentId}`,
          ],
        },
      );

      await waitFor(() => {
        expect(getByTestId('api-error-alert')).to.exist;
        expect(queryByTestId('header')).to.exist;
        expect(queryByTestId('cancel-confirmation-message')).to.not.exist;
      });
    });

    it('should display error alert when getAppointment returns appointment not found', async () => {
      setFetchJSONFailure(
        global.fetch.onCall(0),
        createAppointmentNotFoundError(),
      );

      const { getByTestId, queryByTestId } = renderWithStoreAndRouter(
        <Routes>
          <Route
            path={`${URLS.CANCEL_APPOINTMENT_CONFIRMATION}/:appointmentId`}
            element={<CancelConfirmation />}
          />
        </Routes>,
        {
          ...getDefaultRenderOptions(),
          initialEntries: [
            `${URLS.CANCEL_APPOINTMENT_CONFIRMATION}/${appointmentId}`,
          ],
        },
      );

      await waitFor(() => {
        expect(getByTestId('api-error-alert')).to.exist;
        expect(queryByTestId('header')).to.exist;
        expect(queryByTestId('appointment-card')).to.not.exist;
      });
    });
  });
});
