/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import MockDate from 'mockdate';
import sinon from 'sinon';
import Complete from './index';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import * as usePostTravelClaimsModule from '../../../hooks/usePostTravelClaims';
import * as useUpdateErrorModule from '../../../hooks/useUpdateError';
import * as useStorageModule from '../../../hooks/useStorage';
import { api } from '../../../api';

describe('Check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('travel-claim components', () => {
    describe('Complete', () => {
      const sandbox = sinon.createSandbox();
      const { v2 } = api;
      const store = {
        app: 'travelClaim',
        facilitiesToFile: [
          {
            stationNo: '500',
            startTime: '2024-03-12T10:18:02.422Z',
            appointmentCount: 1,
          },
        ],
      };
      afterEach(() => {
        sandbox.restore();
        MockDate.reset();
      });
      it('renders loading while loading', () => {
        sandbox.stub(usePostTravelClaimsModule, 'usePostTravelClaims').returns({
          travelPayClaimError: false,
          isLoading: true,
        });
        const { getByTestId } = render(
          <CheckInProvider>
            <Complete />
          </CheckInProvider>,
        );
        expect(getByTestId('loading-indicator')).to.exist;
      });
      it('renders page when complete', () => {
        sandbox.stub(usePostTravelClaimsModule, 'usePostTravelClaims').returns({
          travelPayClaimError: false,
          isLoading: false,
        });
        const { getByTestId } = render(
          <CheckInProvider store={store}>
            <Complete />
          </CheckInProvider>,
        );
        expect(getByTestId('header')).to.exist;
        expect(getByTestId('travel-info-external-link')).to.exist;
        expect(getByTestId('travel-complete-content')).to.exist;
      });
      it.skip('calls travel API via hook', () => {
        sandbox.stub(v2, 'postTravelPayClaims').resolves({});
        render(
          <CheckInProvider store={store}>
            <Complete />
          </CheckInProvider>,
        );
        sandbox.assert.calledOnce(v2.postTravelPayClaims);
      });
      it('dispatches error on API error', () => {
        const updateErrorSpy = sinon.spy();
        sandbox.stub(useUpdateErrorModule, 'useUpdateError').returns({
          updateError: updateErrorSpy,
        });
        sandbox.stub(usePostTravelClaimsModule, 'usePostTravelClaims').returns({
          travelPayClaimError: true,
          isLoading: false,
        });
        render(
          <CheckInProvider store={store}>
            <Complete />
          </CheckInProvider>,
        );
        expect(updateErrorSpy.calledOnce).to.be.true;
      });
      it('redirects to intro if questions are skipped', () => {
        const skippedQuestionsStore = {
          app: 'travelClaim',
          facilitiesToFile: [
            {
              stationNo: '500',
              startTime: '2024-03-12T10:18:02.422Z',
              appointmentCount: 1,
            },
          ],
          travelAddress: '',
          travelVehicle: '',
          travelReview: '',
        };
        const push = sinon.spy();
        render(
          <CheckInProvider store={skippedQuestionsStore} router={{ push }}>
            <Complete />
          </CheckInProvider>,
        );
        expect(push.calledOnce).to.be.true;
      });
      it.skip('does not call API on reload or already filed', () => {
        MockDate.set('2024-03-12T10:18:02.422Z');
        sandbox.stub(useStorageModule, 'useStorage').returns({
          getTravelPaySent: () => ({ 500: '2024-03-12T10:18:02.422Z' }),
        });
        sandbox.stub(v2, 'postTravelPayClaims').resolves({});
        render(
          <CheckInProvider store={store}>
            <Complete />
          </CheckInProvider>,
        );
        sandbox.assert.notCalled(v2.postTravelPayClaims);
      });
      it.skip('does call API if station filed before today', () => {
        sandbox.stub(useStorageModule, 'useStorage').returns({
          getTravelPaySent: () => ({ 500: '2024-03-10T15:18:02.422Z' }),
        });
        sandbox.stub(v2, 'postTravelPayClaims').resolves({});
        render(
          <CheckInProvider store={store}>
            <Complete />
          </CheckInProvider>,
        );
        sandbox.assert.calledOnce(v2.postTravelPayClaims);
      });
    });
  });
});
