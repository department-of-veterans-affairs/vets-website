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
} = {}) => ({
  data: {
    veteran: {
      email: email ? vapProfile.email.emailAddress : null,
      mobilePhone: mobile ? vapProfile.mobilePhone : null,
      homePhone: home ? vapProfile.homePhone : null,
      mailingAddress: address ? vapProfile.mailingAddress : null,
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
});
