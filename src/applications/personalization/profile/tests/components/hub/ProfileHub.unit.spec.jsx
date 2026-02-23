import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import * as featureToggles from 'platform/utilities/feature-toggles';
import * as utils from '../../../util/index';
import { renderWithProfileReducersAndRouter as render } from '../../unit-test-helpers';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../../constants';
import ProfileHub from '../../../components/hub/ProfileHub';

const getInitialState = ({
  schedulingPreferencesPilotEligible = false,
  hasBadAddress = false,
} = {}) => ({
  user: {
    profile: {
      schedulingPreferencesPilotEligible,
      vapContactInfo: {
        mailingAddress: {
          badAddress: hasBadAddress,
        },
      },
    },
  },
});

describe('<ProfileHub />', () => {
  const sandbox = sinon.createSandbox();
  let useToggleValueStub;
  let useFeatureToggleStub;

  const renderProfileHub = ({
    hideHealthCareContacts = false,
    isSchedulingPreferencesPilotEligible = false,
    hasBadAddress = false,
  } = {}) => {
    useToggleValueStub.returns(hideHealthCareContacts);
    return render(<ProfileHub />, {
      initialState: getInitialState({
        schedulingPreferencesPilotEligible: isSchedulingPreferencesPilotEligible,
        hasBadAddress,
      }),
      path: '/profile',
    });
  };

  beforeEach(() => {
    sandbox
      .stub(utils, 'getHealthCareSettingsHubDescription')
      .returns('stubbed description');
    useToggleValueStub = sandbox.stub().returns(false);
    useFeatureToggleStub = sandbox.stub(featureToggles, 'useFeatureToggle');
    useFeatureToggleStub.returns({
      TOGGLE_NAMES: {
        profileHideHealthCareContacts: 'profileHideHealthCareContacts',
      },
      useToggleValue: useToggleValueStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
    cleanup();
  });

  it('renders the profile hub links and content', () => {
    const { container, getByText } = renderProfileHub();
    const expectedLinks = [
      {
        text: PROFILE_PATH_NAMES.PERSONAL_INFORMATION,
        href: PROFILE_PATHS.PERSONAL_INFORMATION,
      },
      {
        text: PROFILE_PATH_NAMES.CONTACT_INFORMATION,
        href: PROFILE_PATHS.CONTACT_INFORMATION,
      },
      {
        text: PROFILE_PATH_NAMES.SERVICE_HISTORY_INFORMATION,
        href: PROFILE_PATHS.SERVICE_HISTORY_INFORMATION,
      },
      {
        text: PROFILE_PATH_NAMES.FINANCIAL_INFORMATION,
        href: PROFILE_PATHS.FINANCIAL_INFORMATION,
      },
      {
        text: PROFILE_PATH_NAMES.HEALTH_CARE_SETTINGS,
        href: PROFILE_PATHS.HEALTH_CARE_SETTINGS,
      },
      {
        text: PROFILE_PATH_NAMES.DEPENDENTS_AND_CONTACTS,
        href: PROFILE_PATHS.DEPENDENTS_AND_CONTACTS,
      },
      {
        text: PROFILE_PATH_NAMES.LETTERS_AND_DOCUMENTS,
        href: PROFILE_PATHS.LETTERS_AND_DOCUMENTS,
      },
      {
        text: PROFILE_PATH_NAMES.EMAIL_AND_TEXT_NOTIFICATIONS,
        href: PROFILE_PATHS.EMAIL_AND_TEXT_NOTIFICATIONS,
      },
      {
        text: PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
        href: PROFILE_PATHS.ACCOUNT_SECURITY,
      },
      {
        text: PROFILE_PATH_NAMES.VETERAN_STATUS_CARD,
        href: PROFILE_PATHS.VETERAN_STATUS_CARD,
      },
    ];

    expectedLinks.forEach(({ text, href }) => {
      const link = container.querySelector(`va-link[text="${text}"]`);
      expect(link).to.exist;
      expect(link).to.have.attribute('href', href);
    });

    getByText(
      'Legal name, date of birth, preferred name, and disability rating',
    );
    getByText('Addresses, emails, and phone numbers');
    getByText('Military branches and periods of service');
    getByText(
      'Direct deposit information, payments, benefit overpayments, and copay bills',
    );
    getByText('Benefits dependents and accredited representative or VSO');
    getByText('stubbed description');
    getByText('VA benefit letters and documents and Veteran Status Card');
    getByText('Preferences for receiving email and text notifications');
    getByText('Sign-in information and connected apps');
  });

  it('should render BadAddressAlert when hasBadAddress is true', () => {
    const { container } = renderProfileHub({ hasBadAddress: true });

    const badAddressAlert = container.querySelector(
      '[data-testid="bad-address-profile-alert"]',
    );
    expect(badAddressAlert).to.exist;
    expect(badAddressAlert).to.have.class('vads-u-margin-top--0');
    expect(badAddressAlert).to.have.class('vads-u-margin-bottom--4');
    expect(badAddressAlert).to.have.class('vads-l-col--12');
  });

  it('should not render BadAddressAlert when hasBadAddress is false', () => {
    const { container } = renderProfileHub({ hasBadAddress: false });

    const badAddressAlert = container.querySelector(
      '[data-testid="bad-address-profile-alert"]',
    );
    expect(badAddressAlert).to.not.exist;
  });

  it('should not render BadAddressAlert when hasBadAddress is undefined', () => {
    const { container } = renderProfileHub({ hasBadAddress: undefined });

    const badAddressAlert = container.querySelector(
      '[data-testid="bad-address-profile-alert"]',
    );
    expect(badAddressAlert).to.not.exist;
  });
});
