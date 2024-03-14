import React from 'react';
import { expect } from 'chai';

import DirectDeposit from '@@profile/components/direct-deposit/DirectDeposit';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import { generateFeatureTogglesState } from '../../../mocks/endpoints/feature-toggles';
import { renderWithProfileReducersAndRouter } from '../../unit-test-helpers';

// all required data for direct deposit page in a 'happy path' state
// loading is set to false for dependent api calls
// bank account information is set to a known value for cnp and edu
const createInitialState = ({
  serviceType = CSP_IDS.ID_ME,
  cpnErrors,
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
  toggles = null,
} = {}) => {
  const state = {
    vaProfile: {
      cnpPaymentInformation: {
        controlInformation,
        paymentAccount: {
          financialInstitutionName: 'CNP BANK NAME',
          financialInstitutionRoutingNumber: '*****1533',
          accountNumber: '*******5487',
          accountType: 'Checking',
        },
      },
      eduPaymentInformation: {
        paymentAccount: {
          accountType: 'Checking',
          accountNumber: '********2168',
          financialInstitutionRoutingNumber: '*****2084',
          financialInstitutionName: 'EDU BANK NAME',
        },
      },
      cnpPaymentInformationUiState: {
        isEditing: false,
        isSaving: false,
        responseError: null,
      },
      eduPaymentInformationUiState: {
        isEditing: false,
        isSaving: false,
        responseError: null,
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
    featureToggles: toggles || generateFeatureTogglesState().featureToggles,
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  };
  if (cpnErrors) {
    state.vaProfile = {
      cnpPaymentInformation: {
        error: cpnErrors,
      },
    };
  }

  return state;
};

describe('authenticated experience -- profile -- direct deposit', () => {
  describe('DirectDeposit', () => {
    it('Renders CNP and EDU bank account read state - happy path', () => {
      const { getByText } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: createInitialState({ serviceType: CSP_IDS.ID_ME }),
        },
      );

      expect(getByText(/CNP BANK NAME/i)).to.exist;
      expect(getByText(/EDU BANK NAME/i)).to.exist;
    });

    it('Renders EduMigrationDowntimeAlert when profileShowDirectDepositSingleFormEduDowntime toggle is ON', () => {
      const { getByTestId } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: createInitialState({
            serviceType: CSP_IDS.ID_ME,
            toggles: generateFeatureTogglesState({
              profileShowDirectDepositSingleFormEduDowntime: true,
            }).featureToggles,
          }),
        },
      );

      expect(getByTestId('edu-migration-downtime-alert')).to.exist;
    });

    it('Does not render EduMigrationDowntimeAlert when profileShowDirectDepositSingleFormEduDowntime toggle is OFF', () => {
      const { queryByTestId } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: createInitialState({
            serviceType: CSP_IDS.ID_ME,
            toggles: generateFeatureTogglesState().featureToggles,
          }),
        },
      );

      expect(queryByTestId('edu-migration-downtime-alert')).to.not.exist;
    });

    it('Renders EduMigrationAlert when profileShowDirectDepositSingleFormAlert toggle is ON', () => {
      const { getByText } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: createInitialState({
            serviceType: CSP_IDS.ID_ME,
            toggles: generateFeatureTogglesState({
              profileShowDirectDepositSingleFormAlert: true,
            }).featureToggles,
          }),
          path: '/profile/direct-deposit',
        },
      );

      expect(getByText(/By April 20, 2024/i)).to.exist;
    });

    it('Does not render EduMigrationAlert when profileShowDirectDepositSingleFormAlert toggle is OFF', () => {
      const { queryByText } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: createInitialState({
            serviceType: CSP_IDS.ID_ME,
            toggles: generateFeatureTogglesState().featureToggles,
          }),
          path: '/profile/direct-deposit',
        },
      );

      expect(queryByText(/By April 20, 2024/i)).to.not.exist;
    });

    it('Renders TemporaryOutageCnp when hideDirectDepositCompAndPen is true', () => {
      const { getByText } = renderWithProfileReducersAndRouter(
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
        getByText(
          /Disability and pension direct deposit information isn’t available right now/i,
        ),
      ).to.exist;
    });

    it('Renders VerifyIdentity when showBankInformation is false', () => {
      const state = createInitialState({
        serviceType: CSP_IDS.ID_ME,
        toggles: generateFeatureTogglesState().featureToggles,
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
  });
});
