const all = {
  data: {
    type: 'schedulingPreferences',
    attributes: {
      preferences: [
        {
          itemId: 4,
          optionIds: ['29'],
        },
        {
          itemId: 5,
          optionIds: ['33'],
        },
        {
          itemId: 6,
          optionIds: ['35'],
        },
      ],
    },
  },
};

const none = {
  data: {
    type: 'schedulingPreferences',
    attributes: {
      preferences: [],
    },
  },
};

module.exports = {
  all,
  none,
};
