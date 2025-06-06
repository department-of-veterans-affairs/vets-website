import React from 'react';
import { expect } from 'chai';

import { maximalSetOfPreferences } from '@@profile/mocks/endpoints/communication-preferences';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import {
  mockFetch,
  setFetchJSONResponse,
} from '~/platform/testing/unit/helpers';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';
import NotificationSettings from '../../../components/notification-settings/NotificationSettings';
import { renderWithProfileReducersAndRouter } from '../../unit-test-helpers';

describe('<NotificationSettings />', () => {
  beforeEach(() => {
    mockFetch();
    setFetchJSONResponse(global.fetch.onFirstCall(), maximalSetOfPreferences);
  });

  it('renders happy path with all sections showing', async () => {
    const view = renderWithProfileReducersAndRouter(<NotificationSettings />, {
      initialState: {
        featureToggles: {
          loading: false,
          [featureFlagNames.profileShowMhvNotificationSettingsEmailAppointmentReminders]: true,
          [featureFlagNames.profileShowMhvNotificationSettingsNewSecureMessaging]: true,
          [featureFlagNames.profileShowMhvNotificationSettingsEmailRxShipment]: true,
          [featureFlagNames.profileShowMhvNotificationSettingsMedicalImages]: true,
          [featureFlagNames.profileShowQuickSubmitNotificationSetting]: true,
        },
        user: {
          profile: {
            vapContactInfo: {
              mobilePhone: {
                areaCode: '123',
                number: '5555555',
              },
              email: {
                emailAddress: 'test@test.com',
              },
            },
            facilities: [
              {
                facilityId: '983',
              },
            ],
          },
        },
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
      path: '/profile/notifications',
    });

    await waitFor(() => expect(view.queryByText('Your health care')).to.exist);
    expect(
      await view.queryByText(
        'Applications, claims, decision reviews, and appeals',
      ),
    ).to.exist;

    expect(await view.queryByText('Payments')).to.exist;

    expect(await view.queryByText('General VA Updates and Information')).to.not
      .exist;
    // even when toggle is turned on, QuickSubmit will always be hidden
    expect(await view.queryByText('QuickSubmit')).to.not.exist;
  });

  it('renders loading indicator and hides main section of content', async () => {
    const view = renderWithProfileReducersAndRouter(<NotificationSettings />, {
      initialState: {
        featureToggles: {
          loading: false,
          [featureFlagNames.profileShowMhvNotificationSettingsEmailAppointmentReminders]: true,
          [featureFlagNames.profileShowMhvNotificationSettingsNewSecureMessaging]: true,
          [featureFlagNames.profileShowMhvNotificationSettingsEmailRxShipment]: true,
          [featureFlagNames.profileShowMhvNotificationSettingsMedicalImages]: true,
          [featureFlagNames.profileShowQuickSubmitNotificationSetting]: true,
        },
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
        user: {
          profile: {
            vapContactInfo: {
              mobilePhone: {
                areaCode: '123',
                number: '5555555',
              },
              email: {
                emailAddress: 'test@test.com',
              },
            },
            facilities: [
              {
                facilityId: '983',
              },
            ],
          },
        },
        communicationPreferences: {
          loadingStatus: 'pending',
          loadingErrors: null,
          groups: {
            ids: [],
            entities: {},
          },
          items: {
            ids: [],
            entities: {},
          },
          channels: {
            ids: [],
            entities: {},
          },
        },
      },
      path: '/profile/notifications',
    });

    expect(view.getByTestId('loading-indicator')).to.exist;

    expect(view.queryByText('Your health care')).to.not.exist;
    await waitForElementToBeRemoved(view.getByTestId('loading-indicator'));

    expect(view.queryByText('Your health care')).to.exist;
  });

  it('show alert to add mobile phone info', async () => {
    const view = renderWithProfileReducersAndRouter(<NotificationSettings />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
      path: '/profile/notifications',
    });

    await waitFor(
      () => expect(view.findByTestId('add-mobile-phone-link')).to.exist,
    );

    expect(view.queryByTestId('add-email-address-link')).to.not.exist;
  });

  it('when profileShowEmailNotificationSettings toggle is true, show alert to add email and mobile phone info', async () => {
    const view = renderWithProfileReducersAndRouter(<NotificationSettings />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
        featureToggles: {
          loading: false,
          [featureFlagNames.profileShowMhvNotificationSettingsEmailAppointmentReminders]: true,
        },
      },
      path: '/profile/notifications',
    });

    await waitFor(
      () => expect(view.findByTestId('add-mobile-phone-link')).to.exist,
    );

    expect(await view.findByTestId('add-email-address-link')).to.exist;
  });
});
