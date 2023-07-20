import React from 'react';
import { expect } from 'chai';

import { maximalSetOfPreferences } from '@@profile/mocks/endpoints/communication-preferences';

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
          [featureFlagNames.profileUseNotificationSettingsCheckboxes]: true,
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

  it('show alert to add mobile phone info', async () => {
    const view = renderWithProfileReducersAndRouter(<NotificationSettings />, {
      initialState: {},
      path: '/profile/notifications',
    });

    expect(await view.findByText('Add a mobile phone number to your profile'))
      .to.exist;

    expect(view.queryByText('Add an email address to your profile')).to.not
      .exist;
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

    expect(await view.findByText('Add an email address to your profile')).to
      .exist;
    expect(await view.findByText('Add a mobile phone number to your profile'))
      .to.exist;
  });
});
