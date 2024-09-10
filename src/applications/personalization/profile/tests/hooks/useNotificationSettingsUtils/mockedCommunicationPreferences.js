export const communicationPreferences = {
  loadingStatus: 'loaded',
  loadingErrors: null,
  groups: {
    ids: ['group3', 'group1', 'group2', 'group4', 'group5'],
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
      group2: {
        name: 'General VA Updates and Information',
        description: null,
        items: ['item11'],
      },
      group4: {
        name: 'Payments',
        description: 'Payments to the Veteran',
        items: ['item13', 'item14', 'item5'],
      },
      group5: {
        name: 'QuickSubmit',
        description: 'QuickSubmit Notifications',
        items: ['item12'],
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
      'item11',
      'item5',
      'item12',
      'item13',
      'item14',
    ],
    entities: {
      item3: {
        name: 'Appointment reminders',
        channels: ['channel3-1', 'channel3-2'],
      },
      item4: {
        name: 'Prescription shipment and tracking updates',
        channels: ['channel4-1', 'channel4-2'],
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
      item11: {
        name: 'Biweekly MHV newsletter',
        channels: ['channel11-2'],
      },
      item5: {
        name: 'Disability and pension deposit notifications',
        channels: ['channel5-1'],
      },
      item13: {
        name: 'New benefit overpayment debt notification',
        channels: ['channel13-2'],
      },
      item14: {
        name: 'New health care copay bill',
        channels: ['channel14-2'],
      },
      item12: {
        name: 'QuickSubmit Upload Status',
        channels: ['channel12-1'],
      },
    },
  },
  channels: {
    ids: [
      'channel3-1',
      'channel3-2',
      'channel4-1',
      'channel4-2',
      'channel7-2',
      'channel8-2',
      'channel9-2',
      'channel10-2',
      'channel1-1',
      'channel6-1',
      'channel11-2',
      'channel5-1',
      'channel13-2',
      'channel14-2',
      'channel12-1',
    ],
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
      'channel3-2': {
        channelType: 2,
        parentItem: 'item3',
        isAllowed: false,
        permissionId: 1234,
        defaultSendIndicator: true,
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
        defaultSendIndicator: null,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel4-2': {
        channelType: 2,
        parentItem: 'item4',
        isAllowed: null,
        permissionId: null,
        defaultSendIndicator: null,
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
        defaultSendIndicator: null,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel8-2': {
        channelType: 2,
        parentItem: 'item8',
        isAllowed: false,
        permissionId: 8362,
        defaultSendIndicator: null,
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
        defaultSendIndicator: null,
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
        defaultSendIndicator: null,
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
        defaultSendIndicator: null,
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
        defaultSendIndicator: null,
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
        defaultSendIndicator: null,
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
        defaultSendIndicator: null,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel13-2': {
        channelType: 2,
        parentItem: 'item13',
        isAllowed: null,
        permissionId: null,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel14-2': {
        channelType: 2,
        parentItem: 'item14',
        isAllowed: null,
        permissionId: null,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
      'channel12-1': {
        channelType: 1,
        parentItem: 'item12',
        isAllowed: null,
        permissionId: null,
        defaultSendIndicator: true,
        ui: {
          updateStatus: 'idle',
          errors: null,
        },
      },
    },
  },
};
