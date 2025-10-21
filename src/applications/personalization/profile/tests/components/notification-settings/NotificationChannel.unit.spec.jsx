import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import sinon from 'sinon';

import NotificationChannel from '~/applications/personalization/profile/components/notification-settings/NotificationChannel';

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

  it('renders the VaCheckbox component', () => {
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

    const vaCheckbox = view.getByTestId(`checkbox-${props.channelId}`);
    expect(vaCheckbox).to.be.visible;
  });

  it('renders the "loading" state components', () => {
    const updatedStore = {
      ...baseStore,
      communicationPreferences: {
        ...baseStore.communicationPreferences,
        channels: {
          ...baseStore.communicationPreferences.channels,
          entities: {
            'channel3-1': {
              ...baseStore.communicationPreferences.channels.entities[
                'channel3-1'
              ],
              ui: {
                updateStatus: 'pending',
                errors: null,
              },
            },
          },
        },
      },
    };
    store = mockStore(updatedStore);
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

    const vaCheckbox = view.getByTestId(`checkbox-${props.channelId}`);
    const vaButtonLoading = view.getByTestId(`loading-${props.channelId}`);
    expect(vaCheckbox).to.be.visible;
    expect(vaButtonLoading).to.be.visible;
  });

  it('renders the "success" state components', () => {
    const updatedStore = {
      ...baseStore,
      communicationPreferences: {
        ...baseStore.communicationPreferences,
        channels: {
          ...baseStore.communicationPreferences.channels,
          entities: {
            'channel3-1': {
              ...baseStore.communicationPreferences.channels.entities[
                'channel3-1'
              ],
              ui: {
                updateStatus: 'loaded',
                errors: null,
              },
            },
          },
        },
      },
    };
    store = mockStore(updatedStore);
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

    const vaCheckbox = view.getByTestId(`checkbox-${props.channelId}`);
    const vaAlertSuccess = view.getByTestId(`success-${props.channelId}`);
    expect(vaCheckbox).to.be.visible;
    expect(vaAlertSuccess).to.be.visible;
  });

  it('renders the "error" state components', () => {
    const updatedStore = {
      ...baseStore,
      communicationPreferences: {
        ...baseStore.communicationPreferences,
        channels: {
          ...baseStore.communicationPreferences.channels,
          entities: {
            'channel3-1': {
              ...baseStore.communicationPreferences.channels.entities[
                'channel3-1'
              ],
              ui: {
                updateStatus: 'error',
                errors: null,
              },
            },
          },
        },
      },
    };
    store = mockStore(updatedStore);
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

    const vaCheckbox = view.getByTestId(`checkbox-${props.channelId}`);
    const vaAlertError = view.getByTestId(`error-${props.channelId}`);
    expect(vaCheckbox).to.be.visible;
    expect(vaAlertError).to.be.visible;
  });
});
