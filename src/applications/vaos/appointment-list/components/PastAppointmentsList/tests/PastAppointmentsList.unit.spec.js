import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as apiRequestModule from 'platform/utilities/api';
import PastAppointmentsList from '../index';
import { renderWithStoreAndRouter } from '../../../../tests/mocks/setup';

describe('VAOS Component: PastAppointmentsList API requests', () => {
  let apiRequestStub;

  beforeEach(() => {
    // Stub the axios.get method
    apiRequestStub = sinon
      .stub(apiRequestModule, 'apiRequest')
      .resolves({ data: [] });
  });

  afterEach(() => {
    // Restore the stubbed method
    apiRequestStub.restore();
  });
  describe('when the travelPayViewClaimDetails feature toggle is enabled', () => {
    const initialState = {
      featureToggles: {
        travelPayViewClaimDetails: true,
      },
    };
    it('should call the appointments api with claims appended to the includes parameter', async () => {
      renderWithStoreAndRouter(<PastAppointmentsList />, {
        initialState,
      });

      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.firstCall.args[0]).to.include('/appointments');
      expect(apiRequestStub.firstCall.args[0]).to.include(
        '_include=facilities,clinics,claims',
      );
    });
  });
  describe('when the travelPayViewClaimDetails feature toggle is disabled', () => {
    it('should not call the appointments api with claims appended to the includes parameter', async () => {
      const initialState = {
        featureToggles: {
          travelPayViewClaimDetails: false,
        },
      };

      renderWithStoreAndRouter(<PastAppointmentsList />, {
        initialState,
      });

      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.firstCall.args[0]).to.include('/appointments');
      expect(apiRequestStub.firstCall.args[0]).to.include(
        '_include=facilities,clinics&start',
      );
    });
  });
});
