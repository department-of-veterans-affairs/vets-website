import React from 'react';
import { expect } from 'chai';

import { maximalSetOfPreferences } from '@@profile/mocks/endpoints/communication-preferences';

import { waitForElementToBeRemoved } from '@testing-library/dom';
import NotificationSettings from '../../../components/notification-settings/NotificationSettings';
import { renderWithProfileReducersAndRouter } from '../../unit-test-helpers';

import {
  mockFetch,
  setFetchJSONResponse,
} from '~/platform/testing/unit/helpers';

import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';

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
          [featureFlagNames.profileShowPaymentsNotificationSetting]: true,
          [featureFlagNames.profileShowMhvNotificationSettings]: true,
          [featureFlagNames.profileShowEmailNotificationSettings]: true,
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
      },
      path: '/profile/notifications',
    });

    expect(await view.findByText('Your health care')).to.exist;

    expect(
      await view.findByText(
        'Applications, claims, decision reviews, and appeals',
      ),
    ).to.exist;

    expect(await view.findByText('Payments')).to.exist;

    expect(await view.findByText('General VA Updates and Information')).to
      .exist;

    expect(await view.findByText('QuickSubmit')).to.exist;
  });

  it('renders loading indicator and hides main section of content', async () => {
    const view = renderWithProfileReducersAndRouter(<NotificationSettings />, {
      initialState: {
        featureToggles: {
          loading: false,
          [featureFlagNames.profileShowPaymentsNotificationSetting]: true,
          [featureFlagNames.profileShowMhvNotificationSettings]: true,
          [featureFlagNames.profileShowEmailNotificationSettings]: true,
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
      initialState: {},
      path: '/profile/notifications',
    });

    expect(await view.findByTestId('add-mobile-phone-link')).to.exist;

    expect(view.queryByTestId('add-email-address-link')).to.not.exist;
  });

  it('when profileShowEmailNotificationSettings toggle is true, show alert to add email and mobile phone info', async () => {
    const view = renderWithProfileReducersAndRouter(<NotificationSettings />, {
      initialState: {
        featureToggles: {
          loading: false,
          [featureFlagNames.profileShowEmailNotificationSettings]: true,
        },
      },
      path: '/profile/notifications',
    });

    expect(await view.findByTestId('add-mobile-phone-link')).to.exist;

    expect(await view.findByTestId('add-email-address-link')).to.exist;
  });
});
