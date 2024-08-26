import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';

import { useNotificationSettingsUtils } from '@@profile/hooks';
import TOGGLE_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

import { communicationPreferences } from './mockedCommunicationPreferences';
import { NOTIFICATION_CHANNEL_IDS } from '../../../constants';

const mockStore = configureMockStore();

const TestingComponent = () => {
  const hookResults = useNotificationSettingsUtils();

  // Use a data-testid for selecting in the tests
  return (
    <div data-testid="hookResults">
      {JSON.stringify(hookResults.missingChannels)}
    </div>
  );
};

describe('useNotificationSettingsUtils hook -> missingChannels', () => {
  it('returns empty array when not missing any communication channels in contact info', () => {
    const store = mockStore({
      communicationPreferences,
      featureToggles: {
        loading: false,
        [TOGGLE_NAMES.profileShowPaymentsNotificationSetting]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailAppointmentReminders]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsNewSecureMessaging]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailRxShipment]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsMedicalImages]: false,
        [TOGGLE_NAMES.profileShowQuickSubmitNotificationSetting]: false,
      },
      user: {
        profile: {
          vapContactInfo: {
            email: { emailAddress: 'test@test.com' },
            mobilePhone: {
              areaCode: '555',
              phoneNumber: '5551234',
            },
          },
        },
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <TestingComponent />
      </Provider>,
    );

    const hookResults = JSON.parse(getByTestId('hookResults').textContent);
    expect(hookResults.length).to.equal(0);
  });

  it('returns array with correct channel id when missing mobile phone', () => {
    const store = mockStore({
      communicationPreferences,
      featureToggles: {
        loading: false,
        [TOGGLE_NAMES.profileShowPaymentsNotificationSetting]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailAppointmentReminders]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsNewSecureMessaging]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailRxShipment]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsMedicalImages]: false,
        [TOGGLE_NAMES.profileShowQuickSubmitNotificationSetting]: false,
      },
      user: {
        profile: {
          vapContactInfo: {
            email: { emailAddress: 'test@test.com' },
            mobilePhone: null,
          },
        },
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <TestingComponent />
      </Provider>,
    );

    const hookResults = JSON.parse(getByTestId('hookResults').textContent);
    expect(hookResults.length).to.equal(1);
    expect(hookResults).to.deep.equal([
      { name: 'text', id: parseInt(NOTIFICATION_CHANNEL_IDS.TEXT, 10) },
    ]);
  });

  it('returns array with correct channel id when missing email', () => {
    const store = mockStore({
      communicationPreferences,
      featureToggles: {
        loading: false,
        [TOGGLE_NAMES.profileShowPaymentsNotificationSetting]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailAppointmentReminders]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsNewSecureMessaging]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailRxShipment]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsMedicalImages]: false,
        [TOGGLE_NAMES.profileShowQuickSubmitNotificationSetting]: false,
      },
      user: {
        profile: {
          vapContactInfo: {
            email: null,
            mobilePhone: {
              areaCode: '555',
              phoneNumber: '5551234',
            },
          },
        },
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <TestingComponent />
      </Provider>,
    );

    const hookResults = JSON.parse(getByTestId('hookResults').textContent);
    expect(hookResults.length).to.equal(1);
    expect(hookResults).to.deep.equal([
      { name: 'email', id: parseInt(NOTIFICATION_CHANNEL_IDS.EMAIL, 10) },
    ]);
  });

  it('returns array with both channels when missing email and mobile phone', () => {
    const store = mockStore({
      communicationPreferences,
      featureToggles: {
        loading: false,
        [TOGGLE_NAMES.profileShowPaymentsNotificationSetting]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailAppointmentReminders]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsNewSecureMessaging]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailRxShipment]: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsMedicalImages]: false,
        [TOGGLE_NAMES.profileShowQuickSubmitNotificationSetting]: false,
      },
      user: {
        profile: {
          vapContactInfo: {
            email: null,
            mobilePhone: null,
          },
        },
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <TestingComponent />
      </Provider>,
    );

    const hookResults = JSON.parse(getByTestId('hookResults').textContent);
    expect(hookResults.length).to.equal(2);
    expect(hookResults).to.deep.equal([
      { name: 'email', id: parseInt(NOTIFICATION_CHANNEL_IDS.EMAIL, 10) },
      { name: 'text', id: parseInt(NOTIFICATION_CHANNEL_IDS.TEXT, 10) },
    ]);
  });
});
