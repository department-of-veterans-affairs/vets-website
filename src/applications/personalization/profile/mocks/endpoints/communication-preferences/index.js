const maximalSetOfPreferences = {
  data: {
    id: '',
    type: 'hashes',
    attributes: {
      communicationGroups: [
        {
          id: 4,
          name: 'Payments',
          description: 'Payments to the Veteran',
          communicationItems: [
            {
              id: 13,
              name: 'New benefit overpayment debt notification',
              communicationChannels: [
                {
                  id: 2,
                  name: 'Email',
                  description: 'Email Notification',
                  defaultSendIndicator: true,
                },
              ],
            },
            {
              id: 14,
              name: 'New health care copay bill',
              communicationChannels: [
                {
                  id: 2,
                  name: 'Email',
                  description: 'Email Notification',
                  defaultSendIndicator: true,
                },
              ],
            },
            {
              id: 5,
              name: 'Disability and pension deposit notifications',
              communicationChannels: [
                {
                  id: 1,
                  name: 'Text',
                  description: 'SMS Notification',
                },
              ],
            },
          ],
        },
        {
          id: 1,
          name: 'Applications, claims, decision reviews, and appeals',
          description: null,
          communicationItems: [
            {
              id: 1,
              name: "Board of Veterans' Appeals hearing reminder",
              communicationChannels: [
                {
                  id: 1,
                  name: 'Text',
                  description: 'SMS Notification',
                },
              ],
            },
            {
              id: 6,
              name: 'Appeal status updates',
              communicationChannels: [
                {
                  id: 1,
                  name: 'Text',
                  description: 'SMS Notification',
                },
              ],
            },
            {
              id: 16,
              name: 'Missing claim information',
              communicationChannels: [
                {
                  id: 1,
                  name: 'Text',
                  description: 'SMS Notification',
                },
              ],
            },
          ],
        },
        {
          id: 3,
          name: 'Your health care',
          description: null,
          communicationItems: [
            {
              id: 3,
              name: 'Appointment reminders',
              communicationChannels: [
                {
                  id: 1,
                  name: 'Text',
                  description: 'SMS Notification',
                  communicationPermission: {
                    id: 8596,
                    allowed: true,
                  },
                },
                // this is not currently present from VAProfile, but for testing we want a notification with 2 channels
                // also including the default send indicator for this channel
                {
                  id: 2,
                  name: 'Email',
                  description: 'Email Notification',
                  defaultSendIndicator: true,
                  communicationPermission: {
                    id: 1234,
                    allowed: false,
                  },
                },
              ],
            },
            {
              id: 4,
              name: 'Prescription shipment and tracking updates',
              communicationChannels: [
                {
                  id: 1,
                  name: 'Text',
                  description: 'SMS Notification',
                  communicationPermission: {
                    id: 8361,
                    allowed: false,
                  },
                },
                {
                  id: 2,
                  name: 'Email',
                  description: 'Email Notification',
                },
              ],
            },
            // new communication items https://github.com/department-of-veterans-affairs/va.gov-team/issues/53616
            {
              id: 7,
              name: 'RX refill shipment notification',
              communicationChannels: [
                {
                  id: 2,
                  name: 'Email',
                  description: 'Email Notification',
                  communicationPermission: {
                    id: 8362,
                    allowed: true,
                  },
                },
              ],
            },
            {
              id: 8,
              name: 'VA Appointment reminders',
              communicationChannels: [
                {
                  id: 2,
                  name: 'Email',
                  description: 'Email Notification',
                  communicationPermission: {
                    id: 8362,
                    allowed: false,
                  },
                },
              ],
            },
            {
              id: 9,
              name: 'Secure messaging alert',
              communicationChannels: [
                {
                  id: 2,
                  name: 'Email',
                  description: 'Email Notification',
                  communicationPermission: {
                    id: 8362,
                    allowed: true,
                  },
                },
              ],
            },
            {
              id: 10,
              name: 'Medical images and reports available',
              communicationChannels: [
                {
                  id: 2,
                  name: 'Email',
                  description: 'Email Notification',
                  communicationPermission: {
                    id: 8362,
                    allowed: true,
                  },
                },
              ],
            },
            // end new communication items 53616
          ],
        },
        {
          id: 2,
          name: 'General VA Updates and Information',
          description: null,
          communicationItems: [
            {
              id: 11,
              name: 'Biweekly MHV newsletter',
              communicationChannels: [
                {
                  id: 2,
                  name: 'Email',
                  description: 'Email Notification',
                  communicationPermission: {
                    id: 8362,
                    allowed: true,
                  },
                },
              ],
            },
          ],
        },
        {
          id: 5,
          name: 'QuickSubmit',
          description: 'QuickSubmit Notifications',
          communicationItems: [
            {
              id: 12,
              name: 'QuickSubmit Upload Status',
              communicationChannels: [
                {
                  id: 1,
                  name: 'Text',
                  description: 'SMS Notification',
                  defaultSendIndicator: true,
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

const generateSuccess = () => ({
  txAuditId: 'a9987d62-28f8-4b02-b020-b7f17c13c124',
  status: 'COMPLETED_SUCCESS',
  bio: {
    createDate: '2023-01-05T20:05:25Z',
    updateDate: '2023-06-01T20:55:51Z',
    txAuditId: 'a9987d62-28f8-4b02-b020-b7f17c13c124',
    sourceSystem: 'VETSGOV',
    sourceDate: '2023-06-01T20:55:50Z',
    communicationPermissionId: 18955,
    vaProfileId: 1134122,
    communicationChannelId: 1,
    communicationItemId: 3,
    communicationChannelName: 'Text',
    communicationItemCommonName: 'Appointment reminders',
    allowed: true,
  },
});

module.exports = {
  maximalSetOfPreferences,
  generateSuccess,
};
