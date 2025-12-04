import React from 'react';
import { expect } from 'chai';
import vapProfile from 'platform/user/profile/vap-svc/tests/fixtures/mockVapProfile.json';
import vapService from '@@vap-svc/reducers';
import {
  getContent,
  clearReturnState,
} from 'platform/forms-system/src/js/utilities/data/profile';
import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import ContactInfo from '../ContactInfo';

const getData = ({
  home = true,
  mobile = true,
  email = true,
  address = true,
  onReviewPage = false,
  forwardSpy = () => {},
  updateSpy = () => {},
  requiredKeys = ['mobilePhone', 'homePhone', 'email', 'mailingAddress'],
  uiSchema = {},
  formData = {},
} = {}) => ({
  data: {
    veteran: {
      // email: email ? vapProfile.email.emailAddress : null,
      // mobilePhone: mobile ? vapProfile.mobilePhone : null,
      // homePhone: home ? vapProfile.homePhone : null,
      // mailingAddress: address ? vapProfile.mailingAddress : null,
      email: email ? { ...vapProfile.email, ...formData.email } : null,
      mobilePhone: mobile
        ? { ...vapProfile.mobilePhone, ...formData.mobilePhone }
        : null,
      homePhone: home
        ? { ...vapProfile.homePhone, ...formData.homePhone }
        : null,
      mailingAddress: address
        ? { ...vapProfile.mailingAddress, ...formData.mailingAddress }
        : null,
    },
  },
  setFormData: () => {},
  goBack: () => {},
  goForward: forwardSpy,
  onReviewPage,
  updatePage: updateSpy,
  contentAfterButtons: <div>after</div>,
  contentBeforeButtons: <div>before</div>,

  keys: {
    wrapper: 'veteran',
    homePhone: 'homePhone',
    mobilePhone: 'mobilePhone',
    email: 'email',
    address: 'mailingAddress',
  },
  requiredKeys,
  content: getContent(),
  contactInfoPageKey: 'confirmContactInfo',
  uiSchema,
  prefillPatternEnabled: true,
});

const defaultInitialState = {
  vapService: {},
  user: {
    login: {
      currentlyLoggedIn: true,
    },
    profile: {
      vapContactInfo: vapProfile,
    },
  },
  featureToggles: {
    [TOGGLE_NAMES.aedpPrefill]: true,
  },
};

describe('<ContactInfo>', () => {
  afterEach(() => {
    clearReturnState();
  });

  it('should render with aedpPrefill enabled (smoke test)', () => {
    const props = getData();
    const { container } = renderWithStoreAndRouter(<ContactInfo {...props} />, {
      initialState: defaultInitialState,
      reducers: {
        vapService,
      },
      path: '/contact-information',
    });

    expect(container).to.exist;
  });

  it('should render with aedpPrefill disabled (smoke test)', () => {
    const props = getData();
    const { container } = renderWithStoreAndRouter(<ContactInfo {...props} />, {
      initialState: {
        ...defaultInitialState,
        featureToggles: {
          [TOGGLE_NAMES.aedpPrefill]: false,
        },
      },
      reducers: {
        vapService,
      },
      path: '/contact-information',
    });

    expect(container).to.exist;
  });

  it('should prefill form data when form has newer updatedAt timestamp than profile data', () => {
    const olderProfileData = {
      ...vapProfile,
      mailingAddress: {
        ...vapProfile.mailingAddress,
        addressLine1: '123 Profile Street',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    };

    const newerFormData = {
      mailingAddress: {
        addressLine1: '456 Form Avenue',
        updatedAt: '2025-02-01T00:00:00.000Z', // Newer timestamp
      },
    };

    const props = getData({ formData: newerFormData });

    const { container, getByText } = renderWithStoreAndRouter(
      <ContactInfo {...props} />,
      {
        initialState: {
          ...defaultInitialState,
          user: {
            ...defaultInitialState.user,
            profile: {
              vapContactInfo: olderProfileData,
            },
          },
        },
        reducers: {
          vapService,
        },
        path: '/contact-information',
      },
    );

    expect(container.textContent).to.include('456 Form Avenue');
    expect(getByText('456 Form Avenue, Apt 2')).to.exist;
  });
});
