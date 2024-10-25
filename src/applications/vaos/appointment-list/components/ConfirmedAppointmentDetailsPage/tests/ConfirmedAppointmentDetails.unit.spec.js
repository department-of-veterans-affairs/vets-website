import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as apiRequestModule from 'platform/utilities/api';
import ConfirmedAppointmentDetailsPage from '../index';
import { renderWithStoreAndRouter } from '../../../../tests/mocks/setup';

describe('appointment-list / components / ConfirmedAppointmentDetailsPage', () => {
  let apiRequestStub;

  beforeEach(() => {
    apiRequestStub = sinon
      .stub(apiRequestModule, 'apiRequest')
      .resolves({ data: [] });
  });

  afterEach(() => {
    apiRequestStub.restore();
  });
  describe('when it is a past appointment with the travelPayViewClaimDetails feature enabled', () => {
    it('should call the appointments api with the right arguments', () => {
      const initialState = {
        featureToggles: {
          travelPayViewClaimDetails: true,
        },
      };

      renderWithStoreAndRouter(<ConfirmedAppointmentDetailsPage />, {
        initialState,
        path: '/appointments/past/1312314',
      });

      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.firstCall.args[0]).to.include(
        '_include=facilities,clinics,avs,claims',
      );
    });
  });
  describe('when it is a past appointment with the travelPayViewClaimDetails feature disabled', () => {
    it('should call the appointments api with the right arguments', () => {
      const initialState = {
        featureToggles: {
          travelPayViewClaimDetails: false,
        },
      };

      renderWithStoreAndRouter(<ConfirmedAppointmentDetailsPage />, {
        initialState,
        path: '/appointments/past/1312314',
      });

      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.firstCall.args[0]).to.include(
        '_include=facilities,clinics,avs',
      );
      expect(apiRequestStub.firstCall.args[0]).to.not.include('claims');
    });
  });
  describe('when it is a not a past appointment with the travelPayViewClaimDetails feature enabled', () => {
    it('should call the appointments api with the right arguments', () => {
      const initialState = {
        featureToggles: {
          travelPayViewClaimDetails: true,
        },
      };

      renderWithStoreAndRouter(<ConfirmedAppointmentDetailsPage />, {
        initialState,
        path: '/appointments/1312314',
      });

      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.firstCall.args[0]).to.include(
        '_include=facilities,clinics,avs',
      );
      expect(apiRequestStub.firstCall.args[0]).to.not.include('claims');
    });
  });
});
