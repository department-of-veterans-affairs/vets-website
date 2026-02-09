import React from 'react';
import { expect } from 'chai';

import { fireEvent } from '@testing-library/dom';
import { getVaButtonByText } from '~/applications/personalization/common/unitHelpers';
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
    isCorpAvailable: true,
    isEduClaimAvailable: true,
    isCorpRecFound: true,
    hasNoBdnPayments: true,
    hasIdentity: true,
    hasIndex: true,
    isCompetent: true,
    hasMailingAddress: true,
    hasNoFiduciaryAssigned: true,
    isNotDeceased: true,
    hasPaymentAddress: true,
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
            accountNumber: 'test account number',
            routingNumber: 'test routing number',
            accountType: 'Checking',
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
        services: ['lighthouse'],
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

    it('renders loading indicator when toggles are loading', () => {
      const { container } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: createInitialState({ toggles: { loading: true } }),
        },
      );

      expect(container.querySelector('va-loading-indicator')).to.exist;
    });

    it('Renders TemporaryOutage when hideDirectDeposit is true', () => {
      const { getByRole } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: createInitialState({
            serviceType: CSP_IDS.ID_ME,
            toggles: generateFeatureTogglesState({
              profileHideDirectDeposit: true,
            }).featureToggles,
          }),
          path: '/profile/direct-deposit',
        },
      );

      expect(
        getByRole('heading', {
          name:
            'You can’t manage your direct deposit information online right now',
        }),
      ).to.exist;
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

    it('Renders blocked state when isBlocked is true / user is deceased', () => {
      const state = createInitialState();
      state.directDeposit.controlInformation.isNotDeceased = false;

      const { getByTestId } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: state,
        },
      );

      expect(getByTestId('direct-deposit-blocked')).to.exist;
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

    it('renders ineligible state when canUpdateDirectDeposit is false', () => {
      const state = createInitialState();
      state.directDeposit.controlInformation.canUpdateDirectDeposit = false;

      const { getByText } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: state,
        },
      );

      expect(
        getByText(
          /Our records show that you don’t receive benefit payments from VA/i,
        ),
      ).to.exist;
    });

    it('renders ineligible state when profile services do not include lighthouse', () => {
      const state = createInitialState();
      state.user.profile.services = [];

      const { getByText } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: state,
        },
      );

      expect(
        getByText(
          /Our records show that you don’t receive benefit payments from VA/i,
        ),
      ).to.exist;
    });

    it('renders AccountUpdateView when isEditing is true', async () => {
      const { getByTestId, container } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: createInitialState(),
        },
      );

      const button = getVaButtonByText('Edit', { container });

      fireEvent.click(button);

      // save button is shown when update view is rendered
      expect(getByTestId('save-direct-deposit')).to.exist;
    });
  });
  describe('Montgomery GI Bill', () => {
    it('Renders GI Bill additional information', () => {
      const { getByTestId } = renderWithProfileReducersAndRouter(
        <DirectDeposit />,
        {
          initialState: createInitialState(),
        },
      );

      // Test the va-additional-info element
      const additionalInfoElement = getByTestId('gi-bill-additional-info');
      expect(additionalInfoElement).to.exist;
      expect(additionalInfoElement.getAttribute('trigger').trim()).to.equal(
        'Learn how to update your direct deposit information for Montgomery GI Bill',
      );

      // Test the description paragraph
      const descriptionElement = getByTestId('gi-bill-description');
      expect(descriptionElement).to.exist;

      // Test the link
      const linkElement = getByTestId('gi-bill-update-link');
      expect(linkElement).to.exist;
      expect(linkElement.getAttribute('href').trim()).to.equal(
        'https://www.va.gov/education/verify-school-enrollment/#for-montgomery-gi-bill-benefit',
      );
      expect(linkElement.getAttribute('text').trim()).to.equal(
        'Update direct deposit information for MGIB benefits',
      );
    });
  });
});
