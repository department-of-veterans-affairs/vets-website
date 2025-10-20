import React from 'react';
import { expect } from 'chai';

import { maximalSetOfPreferences } from '@@profile/mocks/endpoints/communication-preferences';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import {
  mockFetch,
  setFetchJSONResponse,
} from '~/platform/testing/unit/helpers';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';
import * as localVapsvc from '~/platform/user/profile/vap-svc/util/local-vapsvc';
import NotificationSettings from '../../../components/notification-settings/NotificationSettings';
import { renderWithProfileReducersAndRouter } from '../../unit-test-helpers';

describe('<NotificationSettings />', () => {
  beforeEach(() => {
    mockFetch();
    setFetchJSONResponse(global.fetch.onFirstCall(), maximalSetOfPreferences);
  });
  it('should not show notification settings content when LOA3 user has no VA Profile ID', async () => {
    // Mock environment to not be localhost so selectIsVAProfileServiceAvailableForUser returns false
    const originalFunction = localVapsvc.isVAProfileServiceConfigured;
    localVapsvc.isVAProfileServiceConfigured = () => false;

    const view = renderWithProfileReducersAndRouter(<NotificationSettings />, {
      initialState: {
        featureToggles: {
          loading: false,
          [featureFlagNames.profileShowMhvNotificationSettingsEmailAppointmentReminders]: true,
          [featureFlagNames.profileShowMhvNotificationSettingsNewSecureMessaging]: true,
          [featureFlagNames.profileShowMhvNotificationSettingsEmailRxShipment]: true,
          [featureFlagNames.profileShowMhvNotificationSettingsMedicalImages]: true,
        },
        user: {
          profile: {
            // LOA3 user
            loa: {
              current: 3,
            },
            // No VA Profile service available - this triggers UNINITIALIZED state
            services: [], // Key: empty services array means no 'vet360' service
            vapContactInfo: {},
            facilities: [
              {
                facilityId: '983',
              },
            ],
          },
        },
        // Initialize vapService state for UNINITIALIZED status
        vapService: {
          transactions: [],
          fieldTransactionMap: {},
          formFields: {},
          modal: null,
          modalData: null,
          addressValidation: {},
          mostRecentlySavedField: null,
          metadata: {
            mostRecentErroredTransactionId: null,
          },
        },
        // Add communicationPreferences state to prevent loading indicator
        communicationPreferences: {
          loadingStatus: 'idle', // Use 'idle' instead of 'pending' to prevent loading
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

    try {
      // The page title and basic structure should still render
      expect(view.getByText('Notification settings')).to.exist;

      // But VA Profile-dependent content should not be visible
      // These elements are wrapped in InitializeVAPServiceID and won't render in UNINITIALIZED state
      expect(view.queryByText('Your health care')).to.not.exist;
      expect(
        view.queryByText('Applications, claims, decision reviews, and appeals'),
      ).to.not.exist;
      expect(view.queryByText('Payments')).to.not.exist;

      // Contact info components should not be visible
      expect(view.queryByTestId('mobile-phone-number-on-file')).to.not.exist;
      expect(view.queryByTestId('email-address-on-file')).to.not.exist;

      // Missing contact info alerts should not show (they're wrapped too)
      expect(view.queryByTestId('add-mobile-phone-link')).to.not.exist;
      expect(view.queryByTestId('add-email-address-link')).to.not.exist;

      // Privacy notice should not be visible
      expect(view.queryByTestId('data-encryption-notice')).to.not.exist;

      // Loading indicator should not be present (different from loading state)
      expect(view.queryByTestId('loading-indicator')).to.not.exist;
    } finally {
      // Restore original document
      localVapsvc.isVAProfileServiceConfigured = originalFunction;
    }
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

    expect(await view.findByTestId('data-encryption-notice')).to.exist;
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

  it('renders the international mobile phone info alert', async () => {
    const view = renderWithProfileReducersAndRouter(<NotificationSettings />, {
      initialState: {
        featureToggles: {
          loading: false,
          [featureFlagNames.profileInternationalPhoneNumbers]: true,
          [featureFlagNames.profileShowMhvNotificationSettingsEmailAppointmentReminders]: true,
        },
        user: {
          profile: {
            vapContactInfo: {
              mobilePhone: {
                areaCode: null,
                countryCode: '93',
                isInternational: true,
                phoneNumber: '201234567',
              },
              email: {
                emailAddress: 'test@test.com',
              },
            },
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

    expect(await view.findByTestId('mobile-phone-number-on-file')).to.exist;
    expect(await view.findByTestId('international-mobile-number-info-alert')).to
      .exist;
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
