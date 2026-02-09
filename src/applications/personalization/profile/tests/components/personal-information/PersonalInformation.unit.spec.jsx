import React from 'react';
import { expect } from 'chai';

import { renderWithProfileReducersAndRouter } from '@@profile/tests/unit-test-helpers';
import PersonalInformation from '@@profile/components/personal-information/PersonalInformation';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/dom';
import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles';
import sinon from 'sinon';
import { PROFILE_PATHS } from '../../../constants';
import * as helpers from '../../../helpers';

function createInitialState(
  { hasUnsavedEdits, toggles, optionalServices = [], mhvAccount } = {
    hasUnsavedEdits: false,
    toggles: {},
    mhvAccount: {},
  },
) {
  const services = [
    ...optionalServices,
    'facilities',
    'hca',
    'edu-benefits',
    'form-save-in-progress',
    'form-prefill',
    'form526',
    'user-profile',
    'appeals-status',
    'id-card',
    'identity-proofed',
    'vet360',
    'lighthouse',
  ];

  return {
    featureToggles: {
      loading: false,
      ...toggles,
    },
    vaProfile: {
      hero: {
        userFullName: {
          first: 'Mitchell',
          middle: 'G',
          last: 'Jenkins',
          suffix: null,
        },
      },
      personalInformation: {
        gender: 'M',
        birthDate: '1986-05-06',
        preferredName: 'Mitch',
        pronouns: ['heHimHis', 'theyThemTheirs'],
        pronounsNotListedText: 'Other/pronouns/here',
        genderIdentity: {
          code: '',
          name: null,
        },
        sexualOrientation: ['straightOrHeterosexual'],
        sexualOrientationNotListedText: 'Some other orientation',
      },
    },
    user: {
      profile: {
        veteranStatus: {
          status: 'OK',
        },
        signIn: {
          serviceName: 'idme',
        },
        services,
        mhvAccount,
      },
    },
    vapService: {
      hasUnsavedEdits,
      initialFormFields: {},
      modal: null,
      modalData: null,
      formFields: {},
      transactions: [],
      fieldTransactionMap: {},
      transactionsAwaitingUpdate: [],
      metadata: {
        mostRecentErroredTransactionId: '',
      },
      addressValidation: {
        addressValidationType: '',
        suggestedAddresses: [],
        confirmedSuggestions: [],
        addressFromUser: {
          addressLine1: '',
          addressLine2: '',
          addressLine3: '',
          city: '',
          stateCode: '',
          zipCode: '',
          countryCodeIso3: '',
        },
        addressValidationError: false,
        validationKey: null,
        selectedAddress: {},
        selectedAddressId: null,
      },
      copyAddressModal: null,
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  };
}

const defaultOptions = {
  path: PROFILE_PATHS.PERSONAL_INFORMATION,
  signInServiceName: 'idme',
  hasUnsavedEdits: false,
};

const setup = (options = defaultOptions) => {
  const optionsWithDefaults = { ...defaultOptions, ...options };
  return renderWithProfileReducersAndRouter(<PersonalInformation />, {
    initialState: createInitialState(optionsWithDefaults),
    path: optionsWithDefaults.path,
  });
};

describe('<PersonalInformation />', () => {
  it('should render without crashing on root path', async () => {
    const { getByText } = setup({ hasUnsavedEdits: true });
    expect(getByText('Personal information', { selector: 'h1' })).to.exist;
  });

  it('should render without crashing on edit hashed path', async () => {
    const { getByText } = setup({
      path: `${PROFILE_PATHS.PERSONAL_INFORMATION}#edit-preferred-name`,
    });
    expect(getByText('Personal information', { selector: 'h1' })).to.exist;
  });

  it('renders Messaging signature section if messagingSignature is not null', async () => {
    const mhvAccount = {
      messagingSignature: {
        signatureName: 'Abraham Lincoln',
        signatureTitle: 'Veteran',
      },
    };

    const featureToggles = {};

    const screen = setup({
      toggles: { ...featureToggles },
      optionalServices: ['messaging'],
      mhvAccount,
    });
    const messagingSignatureSection = screen.getByTestId('messagingSignature');

    expect(messagingSignatureSection.innerHTML).to.contain('Abraham Lincoln');
    expect(messagingSignatureSection.innerHTML).to.contain('Veteran');
  });

  it('does not render Messaging signature section if messaging service is not enabled', async () => {
    const mhvAccount = {
      messagingSignature: {
        signatureName: 'Abraham Lincoln',
        signatureTitle: 'Veteran',
      },
    };

    const screen = setup({
      mhvAccount,
    });

    await waitFor(() => {
      expect(screen.queryByTestId('messagingSignature')).to.not.exist;
    });
  });

  it('does render Messaging signature if profile2 is enabled but health care settings is not enabled', async () => {
    const mhvAccount = {
      messagingSignature: {
        signatureName: 'Abraham Lincoln',
        signatureTitle: 'Veteran',
      },
    };

    const screen = setup({
      toggles: { [TOGGLE_NAMES.profile2Enabled]: true },
      optionalServices: ['messaging'],
      mhvAccount,
    });

    await waitFor(() => {
      expect(screen.getByTestId('messagingSignature')).to.exist;
    });
  });

  it('renders a va-alert if profile2 and health care settings are enabled', async () => {
    sinon.stub(helpers, 'handleRouteChange').callsFake(() => {});

    const screen = setup({
      hasUnsavedEdits: false,
      toggles: {
        [TOGGLE_NAMES.profile2Enabled]: true,
        [TOGGLE_NAMES.profileHealthCareSettingsPage]: true,
      },
      optionalServices: ['messaging'],
    });

    await waitFor(() => {
      expect(screen.queryByTestId('messagingSignature')).to.not.exist;
      expect(screen.getByRole('alert')).to.exist;
      const link = screen.getByRole('link');
      expect(link).to.have.attribute(
        'text',
        'Manage the signature on your messages',
      );
      link.click();
      expect(helpers.handleRouteChange.called).to.be.true;
      helpers.handleRouteChange.restore();
    });
  });

  it('renders the SingleFieldLoadFailAlert if hasError is true', async () => {
    const screen = setup({
      optionalServices: ['messaging'],
      messagingSignature: {
        error: true,
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /something went wrong on our end and we can’t load your signature information/i,
        ),
      ).to.exist;
    });
  });

  it('retrieves the messaging signatue from SM API if messaging is enabled but messagingSignature is not populated', async () => {
    mockApiRequest({
      data: {
        attributes: {
          signatureName: 'Abraham Lincoln',
          signatureTitle: 'Veteran',
          includeSignature: true,
        },
      },
    });
    const screen = setup({
      optionalServices: ['messaging'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('messagingSignature')).to.exist;
    });
    const messagingSignatureSection = screen.getByTestId('messagingSignature');
    expect(messagingSignatureSection.textContent).to.contain('Abraham Lincoln');
    expect(messagingSignatureSection.textContent).to.contain('Veteran');
  });
});
