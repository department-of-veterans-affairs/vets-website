import React from 'react';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { spy } from 'sinon';

import { CSP_IDS } from 'platform/user/authentication/constants';

import DirectDepositWrapper from '../../../components/direct-deposit/DirectDepositWrapper';

import { paymentHistory } from '../../../mocks/payment-history';

describe('authenticated experience -- profile -- direct deposit', () => {
  describe('DirectDepositWrapper', () => {
    const createStore = ({
      serviceType = CSP_IDS.ID_ME,
      cpnErrors,
      controlInformation = {
        canUpdateAddress: true,
        corpAvailIndicator: true,
        corpRecFoundIndicator: true,
        hasNoBdnPaymentsIndicator: true,
        identityIndicator: true,
        isCompetentIndicator: true,
        indexIndicator: true,
        noFiduciaryAssignedIndicator: true,
        notDeceasedIndicator: true,
      },
    } = {}) => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        vaProfile: {
          cnpPaymentInformation: {
            responses: [{ controlInformation }],
          },
        },
        user: {
          profile: {
            signIn: {
              serviceName: serviceType,
            },
          },
          loading: false,
        },
      };
      if (cpnErrors) {
        initState.vaProfile = {
          cnpPaymentInformation: {
            error: cpnErrors,
          },
        };
      }

      return mockStore(initState);
    };
    it('Should render children if rules are met', () => {
      const setViewingIsRestricted = spy();
      const store = createStore({ serviceType: CSP_IDS.ID_ME });

      const { getByTestId } = render(
        <Provider store={store}>
          <DirectDepositWrapper setViewingIsRestricted={setViewingIsRestricted}>
            <div data-testid="child" />
          </DirectDepositWrapper>
        </Provider>,
      );
      expect(getByTestId('child')).to.exist;
      expect(setViewingIsRestricted.called).to.be.false;
    });
    it('Should render Verify Identiy alert if the serviceName does not exist', () => {
      const setViewingIsRestricted = spy();
      const store = createStore({ serviceType: null });

      const { getByTestId, queryByTestId } = render(
        <Provider store={store}>
          <DirectDepositWrapper
            setViewingIsRestricted={setViewingIsRestricted}
          />
        </Provider>,
      );

      expect(getByTestId('direct-deposit-mfa-message')).to.exist;
      expect(queryByTestId('child')).to.be.null;

      expect(setViewingIsRestricted.called).to.be.true;
    });
    it('Should render Verify Identiy alert if the serviceName is DS_LOGON', () => {
      const setViewingIsRestricted = spy();
      const store = createStore({ serviceType: CSP_IDS.DS_LOGON });

      const { getByTestId } = render(
        <Provider store={store}>
          <DirectDepositWrapper
            setViewingIsRestricted={setViewingIsRestricted}
          />
        </Provider>,
      );

      expect(getByTestId('direct-deposit-mfa-message')).to.exist;
      expect(setViewingIsRestricted.called).to.be.true;
    });
    it('Should render Verify Identiy alert if the serviceName is MHV', () => {
      const setViewingIsRestricted = spy();
      const store = createStore({ serviceType: CSP_IDS.MHV });

      const { getByTestId } = render(
        <Provider store={store}>
          <DirectDepositWrapper
            setViewingIsRestricted={setViewingIsRestricted}
          />
        </Provider>,
      );

      expect(getByTestId('direct-deposit-mfa-message')).to.exist;
      expect(setViewingIsRestricted.called).to.be.true;
    });
    it('should render service down if cnpDirectDeposit errored ', () => {
      const setViewingIsRestricted = spy();
      const store = createStore({ cpnErrors: [{}] });

      const { getByTestId, queryByTestId } = render(
        <Provider store={store}>
          <DirectDepositWrapper setViewingIsRestricted={setViewingIsRestricted}>
            <div data-testid="child" />
          </DirectDepositWrapper>
        </Provider>,
      );
      expect(getByTestId('direct-deposit-service-down-alert-headline')).to
        .exist;
      expect(queryByTestId('child')).to.be.null;

      expect(setViewingIsRestricted.called).to.be.true;
    });
    it('should render service down if eduDirectDeposit errored ', () => {
      const setViewingIsRestricted = spy();
      const store = createStore({ cpnErrors: [{}] });
      const { getByTestId, queryByTestId } = render(
        <Provider store={store}>
          <DirectDepositWrapper setViewingIsRestricted={setViewingIsRestricted}>
            <div data-testid="child" />
          </DirectDepositWrapper>
        </Provider>,
      );
      expect(getByTestId('direct-deposit-service-down-alert-headline')).to
        .exist;
      expect(queryByTestId('child')).to.be.null;

      expect(setViewingIsRestricted.called).to.be.true;
    });

    it('should render blocked message if the veteran is deceased', () => {
      const setViewingIsRestricted = spy();
      const store = createStore({
        controlInformation: {
          ...paymentHistory.isDeceased.data.attributes.responses[0]
            .controlInformation,
        },
      });

      const { getByTestId } = render(
        <Provider store={store}>
          <DirectDepositWrapper setViewingIsRestricted={setViewingIsRestricted}>
            <div data-testid="child" />
          </DirectDepositWrapper>
        </Provider>,
      );
      expect(getByTestId('direct-deposit-blocked')).to.exist;
      expect(setViewingIsRestricted.called).to.be.true;
    });
    it('should render blocked message if the veteran is fiduciary', () => {
      const setViewingIsRestricted = spy();
      const store = createStore({
        controlInformation: {
          ...paymentHistory.isFiduciary.data.attributes.responses[0]
            .controlInformation,
        },
      });

      const { getByTestId } = render(
        <Provider store={store}>
          <DirectDepositWrapper setViewingIsRestricted={setViewingIsRestricted}>
            <div data-testid="child" />
          </DirectDepositWrapper>
        </Provider>,
      );
      expect(getByTestId('direct-deposit-blocked')).to.exist;
      expect(setViewingIsRestricted.called).to.be.true;
    });
    it('should render blocked message if the veteran is not competent', () => {
      const setViewingIsRestricted = spy();
      const store = createStore({
        controlInformation: {
          ...paymentHistory.isNotCompetent.data.attributes.responses[0]
            .controlInformation,
        },
      });

      const { getByTestId } = render(
        <Provider store={store}>
          <DirectDepositWrapper setViewingIsRestricted={setViewingIsRestricted}>
            <div data-testid="child" />
          </DirectDepositWrapper>
        </Provider>,
      );
      expect(getByTestId('direct-deposit-blocked')).to.exist;
      expect(setViewingIsRestricted.called).to.be.true;
    });
  });
});
