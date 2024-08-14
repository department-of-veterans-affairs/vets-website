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
      {JSON.stringify(hookResults.useAvailableGroups())}
    </div>
  );
};

describe('useNotificationSettingsUtils hook -> useAvailableGroups', () => {
  it('returns all groups when flags are all true and email and mobile phone are present', () => {
    const store = mockStore({
      communicationPreferences,
      featureToggles: {
        loading: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailAppointmentReminders]: true,
        [TOGGLE_NAMES.profileShowPaymentsNotificationSetting]: true,
        [TOGGLE_NAMES.profileShowQuickSubmitNotificationSetting]: true,
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
    expect(hookResults.length).to.equal(4);

    const expectedGroupNames = [
      'Your health care',
      'Applications, claims, decision reviews, and appeals',
      //  ticket: 89524: hiding the below group
      // 'General VA Updates and Information',
      'Payments',
      'QuickSubmit',
    ];

    expectedGroupNames.forEach(groupName => {
      expect(hookResults.some(({ name }) => name === groupName)).to.be.true;
    });
  });

  it('returns filtered groups when flags are all false and email and mobile phone is present', () => {
    const store = mockStore({
      communicationPreferences,
      featureToggles: {
        loading: false,
        [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailAppointmentReminders]: false,
        [TOGGLE_NAMES.profileShowPaymentsNotificationSetting]: false,
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
    expect(hookResults.length).to.equal(2);

    expect(hookResults.some(({ name }) => name === 'QuickSubmit')).to.be.false;
    expect(hookResults.some(({ name }) => name === 'Payments')).to.be.false;
    expect(
      hookResults.some(
        ({ name }) => name === 'General VA Updates and Information',
      ),
    ).to.be.false;
  });
});
