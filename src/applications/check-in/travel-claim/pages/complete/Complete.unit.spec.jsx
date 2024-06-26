/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import MockDate from 'mockdate';
import sinon from 'sinon';
import Complete from './index';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import * as usePostTravelOnlyClaimModule from '../../../hooks/usePostTravelOnlyClaim';
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
        appointmentToFile: {
          startTime: '2024-03-12T10:18:02.422Z',
          timezone: 'America/Los_Angeles',
        },
        travelAddress: 'yes',
        travelVehicle: 'yes',
        travelReview: 'yes',
      };
      afterEach(() => {
        sandbox.restore();
        MockDate.reset();
      });
      it('renders loading while loading', () => {
        sandbox
          .stub(usePostTravelOnlyClaimModule, 'usePostTravelOnlyClaim')
          .returns({
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
        sandbox
          .stub(usePostTravelOnlyClaimModule, 'usePostTravelOnlyClaim')
          .returns({
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
      it('calls travel API via hook', () => {
        sandbox.stub(v2, 'postTravelOnlyClaim').resolves({});
        render(
          <CheckInProvider store={store}>
            <Complete />
          </CheckInProvider>,
        );
        sandbox.assert.calledOnce(v2.postTravelOnlyClaim);
      });
      it('dispatches error on API error', () => {
        const updateErrorSpy = sinon.spy();
        sandbox.stub(useUpdateErrorModule, 'useUpdateError').returns({
          updateError: updateErrorSpy,
        });
        sandbox
          .stub(usePostTravelOnlyClaimModule, 'usePostTravelOnlyClaim')
          .returns({
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
          appointmentToFile: {
            startTime: '2024-03-12T10:18:02.422Z',
            timezone: 'America/Los_Angeles',
          },
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
      it('does not call API on reload or already filed', () => {
        MockDate.set('2024-03-12T10:18:02.422Z');
        sandbox.stub(useStorageModule, 'useStorage').returns({
          getTravelPaySent: () => '2024-03-12T10:18:02.422Z',
        });
        sandbox.stub(v2, 'postTravelOnlyClaim').resolves({});
        render(
          <CheckInProvider store={store}>
            <Complete />
          </CheckInProvider>,
        );
        sandbox.assert.notCalled(v2.postTravelOnlyClaim);
      });
      it('does call API if filed before today', () => {
        sandbox.stub(useStorageModule, 'useStorage').returns({
          getTravelPaySent: () => '2024-03-10T15:18:02.422Z',
        });
        sandbox.stub(v2, 'postTravelOnlyClaim').resolves({});
        render(
          <CheckInProvider store={store}>
            <Complete />
          </CheckInProvider>,
        );
        sandbox.assert.calledOnce(v2.postTravelOnlyClaim);
      });
    });
  });
});
