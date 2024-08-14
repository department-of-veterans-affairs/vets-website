import React from 'react';
import { cloneDeep, set } from 'lodash';
import { expect } from 'chai';
import NotificationGroup from '~/applications/personalization/profile/components/notification-settings/NotificationGroup';

import {
  createBasicInitialState,
  renderWithProfileReducersAndRouter,
} from '~/applications/personalization/profile/tests/unit-test-helpers';
import TOGGLE_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

const mockCommunicationPreferencesState = {
  loadingStatus: 'loaded',
  loadingErrors: null,
  groups: {
    ids: ['group3', 'group1', 'group4', 'group5', 'group7'],
    entities: {
      group3: {
        name: 'Your health care',
        description: null,
        items: ['item3', 'item4', 'item7', 'item8', 'item9', 'item10'],
      },
      group1: {
        name: 'Applications, claims, decision reviews, and appeals',
        description: null,
        items: ['item1', 'item6'],
      },
      group4: {
        name: 'Payments',
        description: 'Payments to the Veteran',
        items: ['item5'],
      },
      group2: {
        name: 'General VA Updates and Information',
        description: null,
        items: ['item11'],
      },
      group7: {
        name: 'When dinner is ready - custom local',
        description: null,
        items: ['item1234', 'item12345'],
      },
    },
  },
  items: {
    ids: [
      'item3',
      'item4',
      'item7',
      'item8',
      'item9',
      'item10',
      'item1',
      'item6',
      'item5',
      'item11',
      'item1234',
      'item12345',
    ],
    entities: {
      item3: {
        name: 'Appointment reminders',
        channels: ['channel3-1'],
      },
      item4: {
        name: 'Prescription shipment and tracking updates',
        channels: ['channel4-1'],
      },
      item7: {
        name: 'RX refill shipment notification',
        channels: ['channel7-2'],
      },
      item8: {
        name: 'VA Appointment reminders',
        channels: ['channel8-2'],
      },
      item9: {
        name: 'Secure messaging alert',
        channels: ['channel9-2'],
      },
      item10: {
        name: 'Medical images and reports available',
        channels: ['channel10-2'],
      },
      item1: {
        name: "Board of Veterans' Appeals hearing reminder",
        channels: ['channel1-1'],
      },
      item6: {
        name: 'Appeal status updates',
        channels: ['channel6-1'],
      },
      item5: {
        name: 'Disability and pension deposit notifications',
        channels: ['channel5-1'],
      },
      item11: {
        name: 'Biweekly MHV newsletter',
        channels: ['channel11-2'],
      },
      item1234: {
        name: 'To set the table',
        channels: ['channel1234-1'],
      },
      item12345: {
        name: 'To come eat',
        channels: ['channel12345-1'],
      },
    },
  },
  channels: {
    ids: [
      'channel3-1',
      'channel4-1',
      'channel7-2',
      'channel8-2',
      'channel9-2',
      'channel10-2',
      'channel1-1',
      'channel6-1',
      'channel5-1',
      'channel11-2',
      'channel1234-1',
      'channel12345-1',
    ],
    entities: {
      'channel3-1': {
        channelType: 1,
        parentItem: 'item3',
        isAllowed: true,
        permissionId: 8596,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel4-1': {
        channelType: 1,
        parentItem: 'item4',
        isAllowed: false,
        permissionId: 8361,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel7-2': {
        channelType: 2,
        parentItem: 'item7',
        isAllowed: true,
        permissionId: 8362,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel8-2': {
        channelType: 2,
        parentItem: 'item8',
        isAllowed: true,
        permissionId: 8362,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel9-2': {
        channelType: 2,
        parentItem: 'item9',
        isAllowed: true,
        permissionId: 8362,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel10-2': {
        channelType: 2,
        parentItem: 'item10',
        isAllowed: true,
        permissionId: 8362,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel1-1': {
        channelType: 1,
        parentItem: 'item1',
        isAllowed: null,
        permissionId: null,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel6-1': {
        channelType: 1,
        parentItem: 'item6',
        isAllowed: null,
        permissionId: null,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel5-1': {
        channelType: 1,
        parentItem: 'item5',
        isAllowed: null,
        permissionId: null,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel11-2': {
        channelType: 2,
        parentItem: 'item11',
        isAllowed: true,
        permissionId: 8362,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel1234-1': {
        channelType: 1,
        parentItem: 'item1234',
        isAllowed: true,
        permissionId: 8596,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel12345-1': {
        channelType: 1,
        parentItem: 'item12345',
        isAllowed: null,
        permissionId: null,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
    },
  },
};

const baseState = {
  ...createBasicInitialState(),
  featureToggles: {
    [TOGGLE_NAMES.profileShowPaymentsNotificationSetting]: false,
    [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailAppointmentReminders]: false,
    [TOGGLE_NAMES.profileShowMhvNotificationSettingsNewSecureMessaging]: false,
    [TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailRxShipment]: false,
    [TOGGLE_NAMES.profileShowMhvNotificationSettingsMedicalImages]: false,
  },
  communicationPreferences: mockCommunicationPreferencesState,
};

describe('NotificationGroup component', () => {
  it('should render checkbox with label', async () => {
    const initialState = cloneDeep(baseState);

    const view = renderWithProfileReducersAndRouter(
      <NotificationGroup groupId="group4" />,
      {
        initialState,
      },
    );

    expect(
      await view.findByText('Disability and pension deposit notifications'),
    ).to.exist;

    expect(await view.findByTestId('checkbox-channel5-1')).to.exist;
  });

  it('should only see Appointment reminders group when all the notification toggles are turned off', () => {
    const initialState = cloneDeep(baseState);

    set(
      initialState,
      `featureToggles[${
        TOGGLE_NAMES.profileShowMhvNotificationSettingsNewSecureMessaging
      }]`,
      false,
    );

    set(
      initialState,
      `featureToggles[${
        TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailRxShipment
      }]`,
      false,
    );

    set(
      initialState,
      `featureToggles[${
        TOGGLE_NAMES.profileShowMhvNotificationSettingsMedicalImages
      }]`,
      false,
    );

    const view = renderWithProfileReducersAndRouter(
      <NotificationGroup groupId="group3" />,
      {
        initialState,
      },
    );

    expect(view.queryByText('Appointment reminders')).to.exist;

    expect(view.queryByText('Secure messaging alert')).to.not.exist;

    expect(view.queryByText('Prescription shipment and tracking updates')).to
      .not.exist;

    expect(view.queryByText('Medical images and reports available')).to.not
      .exist;
  });

  it('should display Medical images and reports available group when profileShowMhvNotificationSettingsMedicalImages is true', () => {
    const initialState = cloneDeep(baseState);
    set(
      initialState,
      `featureToggles[${
        TOGGLE_NAMES.profileShowMhvNotificationSettingsMedicalImages
      }]`,
      true,
    );

    const view = renderWithProfileReducersAndRouter(
      <NotificationGroup groupId="group3" />,
      {
        initialState,
      },
    );

    expect(view.queryByText('Appointment reminders')).to.exist;

    expect(view.queryByText('Secure messaging alert')).to.not.exist;

    expect(view.queryByText('Prescription shipment and tracking updates')).to
      .not.exist;

    expect(view.queryByText('Medical images and reports available')).to.exist;
  });

  it('should display Securing messaging alert group when profileShowMhvNotificationSettingsNewSecureMessaging is true', () => {
    const initialState = cloneDeep(baseState);
    set(
      initialState,
      `featureToggles[${
        TOGGLE_NAMES.profileShowMhvNotificationSettingsNewSecureMessaging
      }]`,
      true,
    );

    const view = renderWithProfileReducersAndRouter(
      <NotificationGroup groupId="group3" />,
      {
        initialState,
      },
    );

    expect(view.queryByText('Appointment reminders')).to.exist;

    expect(view.queryByText('Secure messaging alert')).to.exist;

    expect(view.queryByText('Prescription shipment and tracking updates')).to
      .not.exist;

    expect(view.queryByText('Medical images and reports available')).to.not
      .exist;
  });

  it('should display Prescription shipment and tracking updates group when profileShowMhvNotificationSettingsEmailRxShipment is true', () => {
    const initialState = cloneDeep(baseState);
    set(
      initialState,
      `featureToggles[${
        TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailRxShipment
      }]`,
      true,
    );

    const view = renderWithProfileReducersAndRouter(
      <NotificationGroup groupId="group3" />,
      {
        initialState,
      },
    );

    expect(view.queryByText('Appointment reminders')).to.exist;

    expect(view.queryByText('Secure messaging alert')).to.not.exist;

    expect(view.queryByText('Prescription shipment and tracking updates')).to
      .exist;

    expect(view.queryByText('Medical images and reports available')).to.not
      .exist;
  });

  it('should never display Rx refill shipment and Biweekly MHV newsletter even when all the notification toggles are on', () => {
    const initialState = cloneDeep(baseState);
    set(
      initialState,
      `featureToggles[${
        TOGGLE_NAMES.profileShowMhvNotificationSettingsMedicalImages
      }]`,
      true,
    );

    set(
      initialState,
      `featureToggles[${
        TOGGLE_NAMES.profileShowMhvNotificationSettingsNewSecureMessaging
      }]`,
      true,
    );

    set(
      initialState,
      `featureToggles[${
        TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailRxShipment
      }]`,
      true,
    );

    set(
      initialState,
      `featureToggles[${
        TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailAppointmentReminders
      }]`,
      true,
    );

    const view = renderWithProfileReducersAndRouter(
      <NotificationGroup groupId="group3" />,
      {
        initialState,
      },
    );

    expect(view.queryByText('Appointment reminders')).to.exist;

    expect(view.queryByText('Secure messaging alert')).to.exist;

    expect(view.queryByText('Prescription shipment and tracking updates')).to
      .exist;

    expect(view.queryByText('Medical images and reports available')).to.exist;

    expect(view.queryByText('Rx refill shipment')).to.not.exist;

    expect(view.queryByText('Biweekly MHV newsletter')).to.not.exist;
  });
});
