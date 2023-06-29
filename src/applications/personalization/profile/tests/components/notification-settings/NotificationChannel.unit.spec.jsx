import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import sinon from 'sinon';

import NotificationChannel from '~/applications/personalization/profile/components/notification-settings/NotificationChannel';

import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';

const mockStore = configureMockStore();

const baseStore = {
  user: {
    profile: {
      vapContactInfo: {
        mobilePhone: {
          phoneNumber: '5555555',
        },
      },
    },
  },
  featureToggles: {
    [featureFlagNames.profileUseNotificationSettingsCheckboxes]: true,
  },
  communicationPreferences: {
    groups: {
      ids: ['group3'],
      entities: {
        group3: {
          name: 'Your health care',
          description: null,
          items: ['item3'],
        },
      },
    },
    items: {
      ids: ['item3'],
      entities: {
        item3: {
          name: 'Appointment reminders',
          channels: ['channel3-1', 'channel3-2'],
        },
      },
    },

    channels: {
      ids: ['channel3-1'],
      entities: {
        'channel3-1': {
          channelType: 1,
          parentItem: 'item3',
          isAllowed: true,
          permissionId: 8596,
          defaultSendIndicator: null,
          ui: {
            updateStatus: 'idle',
            errors: null,
          },
        },
      },
    },
  },
};

describe('<NotificationChannel />', () => {
  let store;

  beforeEach(() => {
    store = mockStore(baseStore);
  });

  it('renders the NotificationCheckbox component when featureToggle is set to true', () => {
    const props = {
      channelId: 'channel3-1',
      disabledForCheckbox: false,
      saveSetting: sinon.stub(),
    };

    const view = render(
      <Provider store={store}>
        <NotificationChannel {...props} />
      </Provider>,
    );

    expect(view.getByTestId(`checkbox-${props.channelId}`)).to.be.visible;
  });

  it('renders the NotificationRadioButtons component when featureToggle is set to false', () => {
    store = mockStore({
      ...baseStore,
      featureToggles: {
        [featureFlagNames.profileUseNotificationSettingsCheckboxes]: false,
      },
    });

    const props = {
      channelId: 'channel3-1',
      disabledForCheckbox: false,
      saveSetting: sinon.stub(),
    };

    const view = render(
      <Provider store={store}>
        <NotificationChannel {...props} />
      </Provider>,
    );

    // renders both labels that are present when using radio buttons
    expect(view.getByText('Notify me by text')).to.be.visible;
    expect(view.getByText('Don’t notify me')).to.be.visible;
  });
});
