import React from 'react';
import { expect } from 'chai';
import { renderWithProfileReducersAndRouter } from '@@profile/tests/unit-test-helpers';
import { Hub } from '@@profile/components/hub/Hub';
import FEATURE_FLAGS from '~/platform/utilities/feature-toggles/featureFlagNames';
import { SERVICE_PROVIDERS } from '~/platform/user/authentication/constants';
import { PROFILE_PATHS } from '../../../constants';

function createInitialState(
  { badAddress, signInServiceName, toggles } = {
    badAddress: false,
    signInServiceName: 'idme',
    toggles: {},
  },
) {
  return {
    featureToggles: {
      loading: false,
      ...toggles,
    },
    user: {
      profile: {
        veteranStatus: {
          status: 'OK',
        },
        vapContactInfo: {
          mailingAddress: {
            badAddress,
          },
        },
        signIn: {
          serviceName: signInServiceName,
        },
      },
    },
  };
}

const defaultOptions = {
  path: PROFILE_PATHS.PROFILE_ROOT,
  badAddress: false,
  signInServiceName: 'idme',
};

const setup = (options = defaultOptions) => {
  const optionsWithDefaults = { ...defaultOptions, ...options };
  return renderWithProfileReducersAndRouter(<Hub />, {
    initialState: createInitialState(optionsWithDefaults),
    path: optionsWithDefaults.path,
  });
};

describe('<Hub />', () => {
  it('should render without crashing', () => {
    const { getByText } = setup();
    expect(getByText('Profile', { selector: 'h1' })).to.exist;
  });

  it('should render BadAddressAlert when hasBadAddress is true', () => {
    const { getByTestId } = setup({ badAddress: true });
    expect(getByTestId('bad-address-profile-alert')).to.exist;
  });

  it('should not render BadAddressAlert when hasBadAddress is false', () => {
    const { queryByTestId } = setup({ badAddress: false });
    expect(queryByTestId('bad-address-profile-alert')).to.not.exist;
  });

  it('should render accredited rep when representativeStatusEnableV2Features is true', () => {
    const { getByText } = setup({
      toggles: { [FEATURE_FLAGS.representativeStatusEnableV2Features]: true },
    });
    expect(getByText('Check your accredited representative or VSO')).to.exist;
  });

  it('should hide health care contacts when profileHideHealthCareContacts is true', () => {
    const { queryByText } = setup({
      toggles: { [FEATURE_FLAGS.profileHideHealthCareContacts]: true },
    });
    expect(queryByText('Review your personal health care contacts')).to.not
      .exist;
  });

  it('should render health care contacts when profileHideHealthCareContacts is false', () => {
    const { getByText } = setup({
      toggles: { [FEATURE_FLAGS.profileHideHealthCareContacts]: false },
    });
    expect(getByText('Review your personal health care contacts')).to.exist;
  });

  it('should render Paperless Delivery link when profileShowPaperlessDelivery is true', () => {
    const { getByRole } = setup({
      toggles: { [FEATURE_FLAGS.profileShowPaperlessDelivery]: true },
    });
    expect(
      getByRole('link', {
        name: 'Update paperless delivery settings',
      }),
    ).to.exist;
  });

  it('should not render Paperless Delivery link when profileShowPaperlessDelivery is false', () => {
    const { queryByRole } = setup({
      toggles: { [FEATURE_FLAGS.profileShowPaperlessDelivery]: false },
    });
    expect(
      queryByRole('link', {
        name: 'Update paperless delivery settings',
      }),
    ).to.not.exist;
  });

  Object.values(SERVICE_PROVIDERS).forEach(service => {
    it('should render with the correct service name and link', () => {
      const { container, getByText } = setup({
        signInServiceName: service.policy,
      });
      expect(
        getByText(`Update your sign-in info on the ${service.label} website`),
      ).to.exist;
      expect(container.querySelector(`[href="${service.link}"]`)).to.exist;
    });
  });
});
