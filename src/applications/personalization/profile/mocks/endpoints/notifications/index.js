const createNotificationSuccess = () => {
  return {
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
            id: 7,
            name: 'When dinner is ready - custom local',
            description: null,
            communicationItems: [
              {
                id: 1234,
                name: 'To set the table',
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
                ],
              },
              {
                id: 12345,
                name: 'To come eat',
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
                ],
              },
            ],
          },
        ],
      },
    },
  };
};

module.exports = {
  createNotificationSuccess,
};
