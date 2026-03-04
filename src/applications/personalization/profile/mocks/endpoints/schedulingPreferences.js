const all = {
  data: {
    type: 'schedulingPreferences',
    attributes: {
      preferences: [
        {
          itemId: 1, // preferredContactMethod
          optionIds: ['4'], // mailingAddress
          // optionIds: ['39'], // workPhone
        },
        {
          itemId: 2, // preferredContactTimes
          optionIds: ['17'], // noPreference
          // optionIds: ['10', '14'], // tuesdayAfternoon, thursdayAfternoon
        },
        {
          itemId: 3, // preferredAppointmentTimes
          optionIds: ['28'], // noPreference
          // optionIds: ['18', '20', '21', '23'], // Monday morning, Tuesday morning or afternoon, Wednesday afternoon
        },
        {
          itemId: 4, // needsHelpSchedulingAppointments
          optionIds: ['29'], // yes
        },
        {
          itemId: 5, // needsHelpChoosingProvider
          optionIds: ['33'], // no
        },
        {
          itemId: 6, // preferredProviderGender
          optionIds: ['35'], // male
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
