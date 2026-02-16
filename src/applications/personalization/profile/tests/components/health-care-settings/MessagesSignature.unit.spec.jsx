import React from 'react';
import { expect } from 'chai';

import { renderWithProfileReducersAndRouter } from '@@profile/tests/unit-test-helpers';
import MessagesSignature from '@@profile/components/health-care-settings/MessagesSignature';
import { waitFor } from '@testing-library/dom';
import { PROFILE_PATHS } from '../../../constants';

function createInitialState(
  {
    hasUnsavedEdits,
    toggles,
    optionalServices = [],
    mhvAccount,
    vaPatient = true,
  } = {
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
      ...{
        loading: false,
      },
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
        vaPatient,
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
  path: PROFILE_PATHS.MESSAGES_SIGNATURE,
  signInServiceName: 'idme',
  hasUnsavedEdits: false,
  toggles: { profile2Enabled: true },
};

const setup = (options = defaultOptions) => {
  const optionsWithDefaults = {
    ...defaultOptions,
    ...options,
  };
  return renderWithProfileReducersAndRouter(<MessagesSignature />, {
    initialState: createInitialState(optionsWithDefaults),
    path: optionsWithDefaults.path,
  });
};

describe('<MessagesSignature /> in profile 2.0', () => {
  it('should render without crashing on root path', async () => {
    const { getByText } = setup({ hasUnsavedEdits: true });
    await waitFor(() => {
      expect(document.title).to.equal('Messages Signature | Veterans Affairs');
      expect(getByText('Messages signature', { selector: 'h1' })).to.exist;
    });
  });

  it('renders Messaging signature section if messagingSignature is not null', async () => {
    const mhvAccount = {
      messagingSignature: {
        signatureName: 'Abraham Lincoln',
        signatureTitle: 'Veteran',
      },
    };

    const screen = setup({
      optionalServices: ['messaging'],
      mhvAccount,
    });

    const messagingSignatureSection = screen.getByTestId('messagingSignature');

    expect(messagingSignatureSection.innerHTML).to.contain('Abraham Lincoln');
    expect(messagingSignatureSection.innerHTML).to.contain('Veteran');
  });

  it('renders <NonVAPatientMessage /> if user is not a VA patient', async () => {
    const screen = setup({
      optionalServices: ['messaging'],
      vaPatient: false,
    });

    await waitFor(() => {
      expect(screen.getByTestId('non-va-patient-message')).to.exist;
    });
  });

  it.skip('does not render Messaging signature section if messaging service is not enabled', async () => {
    // TODO: Await feedback form UX about how to handle a user that has health care but messaging service is disabled
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
});
