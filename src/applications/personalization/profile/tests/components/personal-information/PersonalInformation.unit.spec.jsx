import React from 'react';
import { expect } from 'chai';

import { renderWithProfileReducersAndRouter } from '@@profile/tests/unit-test-helpers';
import PersonalInformation from '@@profile/components/personal-information/PersonalInformation';
import { PROFILE_PATHS } from '../../../constants';

function createInitialState(
  { hasUnsavedEdits, toggles } = {
    hasUnsavedEdits: false,
    toggles: {},
  },
) {
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
        services: [
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
        ],
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
  it('should render without crashing on root path', () => {
    const { getByText } = setup({ hasUnsavedEdits: true });
    expect(getByText('Personal information', { selector: 'h1' })).to.exist;
  });

  it('should render without crashing on edit hashed path', () => {
    const { getByText } = setup({
      path: `${PROFILE_PATHS.PERSONAL_INFORMATION}#edit-preferred-name`,
    });
    expect(getByText('Personal information', { selector: 'h1' })).to.exist;
  });
});
