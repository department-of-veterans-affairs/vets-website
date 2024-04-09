import React from 'react';
import { expect } from 'chai';

import { DirectDeposit } from '~/applications/personalization/profile/components/direct-deposit/DirectDeposit';

import { Toggler } from '~/platform/utilities/feature-toggles';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import { generateFeatureTogglesState } from '../../../mocks/endpoints/feature-toggles';
import { renderWithProfileReducersAndRouter } from '../../unit-test-helpers';

const baseToggles = generateFeatureTogglesState({
  [Toggler.TOGGLE_NAMES.profileShowDirectDepositSingleForm]: true,
}).featureToggles;

// all required data for direct deposit page in a 'happy path' state
// loading is set to false for dependent api calls
// bank account information is set to a known value for cnp and edu
const createInitialState = ({
  serviceType = CSP_IDS.ID_ME,
  saveError,
  loadError,
  controlInformation = {
    canUpdateDirectDeposit: true,
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
  toggles = baseToggles,
} = {}) => {
  const state = {
    directDeposit: {
      controlInformation,
      paymentAccount: loadError
        ? null
        : {
            name: 'TEST BANK NAME',
            accountNumber: 'test acount number',
            routingNumber: 'test routing number',
          },
      loadError: null,
      saveError: saveError || null,
      ui: {
        isEditing: false,
        isSaving: false,
      },
    },
    user: {
      profile: {
        loa: {
          current: 3,
        },
        signIn: {
          serviceName: serviceType,
        },
        multifactor: true,
        session: {
          authBroker: 'sis',
        },
        loading: false,
      },
    },
    featureToggles: toggles || baseToggles,
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  };

  if (loadError) {
    state.directDeposit.loadError = loadError;
  }

  return state;
};

describe('authenticated experience -- profile -- unified direct deposit', () => {
  describe('DirectDeposit', () => {
    it('Renders bank account read state - happy path', () => {
      const { getByText } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: createInitialState({ serviceType: CSP_IDS.ID_ME }),
        },
      );

      expect(getByText(/TEST BANK NAME/i)).to.exist;
    });

    // TODO: remove 'CompAndPen' from the toggle name for use within unified direct deposit
    it('Renders TemporaryOutage when hideDirectDepositCompAndPen is true', () => {
      const { getByRole } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: createInitialState({
            serviceType: CSP_IDS.ID_ME,
            toggles: generateFeatureTogglesState({
              profileHideDirectDepositCompAndPen: true,
            }).featureToggles,
          }),
          path: '/profile/direct-deposit',
        },
      );

      expect(
        getByRole('heading', {
          name: 'Direct deposit information isn’t available right now',
        }),
      ).to.exist;
    });

    it('Renders VerifyIdentity when showBankInformation is false', () => {
      const state = createInitialState({
        serviceType: CSP_IDS.ID_ME,
      });

      state.user.profile.multifactor = false;

      const { getByTestId } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: state,
          path: '/profile/direct-deposit',
        },
      );

      expect(getByTestId('direct-deposit-mfa-message')).to.exist;
    });

    it('Renders error state when error is present', () => {
      const { getByRole } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: createInitialState({
            serviceType: CSP_IDS.ID_ME,
            loadError: 'Internal Server Error',
          }),
          path: '/profile/direct-deposit',
        },
      );

      expect(
        getByRole('heading', { name: "This page isn't available right now." }),
      ).to.exist;
    });
  });
});
