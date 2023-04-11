const templateId = 'f9947b27-df3b-4b09-875c-7f76594d766d';

const hasMultiple = {
  data: [
    {
      id: 'e4213b12-eb44-4b2f-bac5-3384fbde0b7a',
      type: 'onsite_notifications',
      attributes: {
        templateId,
        vaProfileId: '1273780',
        dismissed: false,
        createdAt: new Date(2023, 1, 25),
        updatedAt: new Date(2023, 2, 5),
      },
    },
    {
      id: 'f9947b27-df3b-4b09-875c-7f76594d766d',
      type: 'onsite_notifications',
      attributes: {
        templateId,
        vaProfileId: '1273780',
        dismissed: false,
        createdAt: new Date(2023, 2, 28),
        updatedAt: new Date(2023, 3, 1),
      },
    },
  ],
};

const dismissalReceived = {
  success: {
    data: {
      id: '',
      type: 'onsite_notifications',
      attributes: {
        dismissed: true,
      },
    },
  },
};

const dismissedSuccess = {
  data: [
    {
      id: '',
      type: 'onsite_notifications',
      attributes: {
        templateId,
        vaProfileId: '',
        dismissed: true,
        createdAt: '',
        updatedAt: 'new Date(2023, 3, 1)',
      },
    },
  ],
};

const none = {
  data: [],
};

const hasError = {
  errors: [
    {
      title: 'Server Error',
      code: '500',
      status: '500',
    },
  ],
};

module.exports = {
  hasMultiple,
  dismissalReceived,
  dismissedSuccess,
  none,
  hasError,
};
