import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';

import {
  renderWithStoreAndRouter,
  createTestStore,
} from '../../../../tests/mocks/setup';
import { createProviderDetails } from '../../../utils/provider';
import { FETCH_STATUS } from '../../../../utils/constants';
import * as getProviderByIdModule from '../../../../services/referral';

import TestComponent from './TestComponent';

describe('Community Care Referrals', () => {
  describe('useGetProviderById hook', () => {
    const sandbox = sinon.createSandbox();
    const providerDetails = createProviderDetails(1, '111');
    const initialState = {
      referral: {
        selectedProvider: providerDetails,
        providerFetchStatus: FETCH_STATUS.succeeded,
      },
    };
    beforeEach(() => {
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      sandbox
        .stub(getProviderByIdModule, 'getProviderById')
        .resolves(providerDetails);
    });
    afterEach(() => {
      sandbox.restore();
      global.XMLHttpRequest.restore();
    });
    it('should not return or fetch provider if no providerId is passed', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <TestComponent providerId={null} />,
        {
          store: createTestStore(initialState),
        },
      );
      expect(getByTestId('test-component')).to.exist;
      expect(getByTestId('loading')).to.contain.text('loading: false');
      expect(getByTestId('fail-status')).contains.text('fail status: false');
      expect(getByTestId('provider-name')).to.be.empty;
      expect(getByTestId('provider-id')).to.be.empty;
      sandbox.assert.notCalled(getProviderByIdModule.getProviderById);
    });
    it('should not fetch provider if it exists in redux', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <TestComponent providerId={providerDetails.id} />,
        {
          store: createTestStore(initialState),
        },
      );
      expect(getByTestId('test-component')).to.exist;
      await waitFor(() => {
        expect(getByTestId('loading')).to.contain.text('loading: false');
      });
      expect(getByTestId('fail-status')).contains.text('fail status: false');
      expect(getByTestId('provider-name')).contains.text(
        providerDetails.providerName,
      );
      expect(getByTestId('provider-id')).to.contain.text(providerDetails.id);
      sandbox.assert.notCalled(getProviderByIdModule.getProviderById);
    });
    it.skip('should fetch provider if not in redux', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <TestComponent providerId={providerDetails.id} />,
        {
          store: createTestStore({
            ...initialState,
            referral: {
              selectedProvider: {},
              providerFetchStatus: FETCH_STATUS.notStarted,
            },
          }),
        },
      );
      await waitFor(() => {
        expect(getByTestId('loading')).to.contain.text('loading: true');
      });
      await waitFor(() => {
        sandbox.assert.calledOnce(getProviderByIdModule.getProviderById);
      });
    });
    it('should fetch new provider if provider in redux is not the one requested', async () => {
      const otherProvider = createProviderDetails(1, '222');
      sandbox.restore();
      sandbox
        .stub(getProviderByIdModule, 'getProviderById')
        .resolves(otherProvider);
      const { getByTestId } = renderWithStoreAndRouter(
        <TestComponent providerId={otherProvider.id} />,
        {
          store: createTestStore(initialState),
        },
      );
      await waitFor(() => {
        expect(getByTestId('loading')).to.contain.text('loading: true');
      });
      await waitFor(() => {
        sandbox.assert.calledOnce(getProviderByIdModule.getProviderById);
      });
    });
    it('should show the error message if fetch fails', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <TestComponent providerId={providerDetails.id} />,
        {
          store: createTestStore({
            ...initialState,
            referral: {
              selectedProvider: {},
              providerFetchStatus: FETCH_STATUS.failed,
            },
          }),
        },
      );
      expect(getByTestId('fail-status')).to.contain.text('fail status: true');
    });
  });
});
