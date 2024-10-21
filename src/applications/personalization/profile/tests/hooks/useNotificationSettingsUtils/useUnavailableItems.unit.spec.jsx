import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';

import { useNotificationSettingsUtils } from '@@profile/hooks';
import TOGGLE_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

import { communicationPreferences } from './mockedCommunicationPreferences';

const mockStore = configureMockStore();

const TestingComponent = () => {
  const hookResults = useNotificationSettingsUtils();

  // Use a data-testid for selecting in the tests
  return (
    <div data-testid="hookResults">
      {JSON.stringify(hookResults.useUnavailableItems())}
    </div>
  );
};

const emailNotificationNames = [
  'Appointment reminders',
  'Prescription shipment and tracking updates',
  'Secure messaging alert',
  'Medical images and reports available',
  // will never be visible per ticket# 89524
  // 'RX refill shipment notification',
  // 'VA Appointment reminders',
  // 'Biweekly MHV newsletter',
  'New benefit overpayment debt notification',
  'New health care copay bill',
];

const textNotificationNames = [
  'Appointment reminders',
  'Prescription shipment and tracking updates',
  "Board of Veterans' Appeals hearing reminder",
  'Appeal status updates',
  'Disability and pension deposit notifications',
  // QuickSubmit will never be visible per ticket# 89524
  // 'QuickSubmit Upload Status',
];

describe('useNotificationSettingsUtils hook -> useUnavailableItems', () => {
  it('returns items with email notifications when email is missing from contact info', () => {
    const store = mockStore({
      communicationPreferences,
      featureToggles: {
        loading: false,
        [TOGGLE_NAMES.profileShowPaymentsNotificationSetting]: true,
        [TOGGLE_NAMES.profileShowNewBenefitOverpaymentDebtNotificationSetting]: true,
        [TOGGLE_NAMES.profileShowNewHealthCareCopayBillNotificationSetting]: true,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailAppointmentReminders]: true,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsNewSecureMessaging]: true,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailRxShipment]: true,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsMedicalImages]: true,
        [TOGGLE_NAMES.profileShowQuickSubmitNotificationSetting]: true,
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

    const includedNames = hookResults.map(({ name }) =>
      emailNotificationNames.includes(name),
    );

    expect(includedNames.every(result => result === true)).to.be.true;

    expect(hookResults.length).to.equal(6);
  });

  it('returns items with text notifications when mobile phone is missing from contact info', () => {
    const store = mockStore({
      communicationPreferences,
      featureToggles: {
        loading: false,
        [TOGGLE_NAMES.profileShowPaymentsNotificationSetting]: true,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailAppointmentReminders]: true,
        [TOGGLE_NAMES.profileShowQuickSubmitNotificationSetting]: true,
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

    const includedNames = hookResults.map(({ name }) =>
      textNotificationNames.includes(name),
    );
    expect(includedNames.every(result => result === true)).to.be.true;

    expect(hookResults.length).to.equal(5);
  });
});
