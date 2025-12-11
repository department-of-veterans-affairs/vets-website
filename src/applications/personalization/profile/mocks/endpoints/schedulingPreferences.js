const allSet = {
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

const noneSet = {
  data: {
    type: 'schedulingPreferences',
    attributes: {
      preferences: [],
    },
  },
};

module.exports = {
  allSet,
  noneSet,
};
