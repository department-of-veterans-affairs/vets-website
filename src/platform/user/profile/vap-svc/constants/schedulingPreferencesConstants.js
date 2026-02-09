export const FIELD_NAMES = {
  SCHEDULING_PREF_CONTACT_METHOD: 'preferredContactMethod',
  SCHEDULING_PREF_CONTACT_TIMES: 'preferredContactTimes',
  SCHEDULING_PREF_HELP_SCHEDULING: 'needsHelpSchedulingAppointments',
  SCHEDULING_PREF_APPOINTMENT_TIMES: 'preferredAppointmentTimes',
  SCHEDULING_PREF_PROVIDER_GENDER: 'preferredProviderGender',
  SCHEDULING_PREF_HELP_CHOOSING: 'needsHelpChoosingProvider',
};

export const FIELD_ITEM_IDS = {
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]: 1,
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES]: 2,
  [FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING]: 4,
  [FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]: 3,
  [FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER]: 6,
  [FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING]: 5,
};

export const FIELD_OPTION_IDS = {
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]: {
    TELEPHONE_MOBILE: 'option-1',
    TELEPHONE_HOME: 'option-38',
    TELEPHONE_WORK: 'option-39',
    TEXT_MESSAGE: 'option-2',
    SECURE_MESSAGE: 'option-3',
    US_POST: 'option-4',
    EMAIL: 'option-5',
    NO_PREFERENCE: 'option-6',
  },
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES]: {
    MONDAY_MORNING: 'option-7',
    MONDAY_AFTERNOON: 'option-8',
    TUESDAY_MORNING: 'option-9',
    TUESDAY_AFTERNOON: 'option-10',
    WEDNESDAY_MORNING: 'option-11',
    WEDNESDAY_AFTERNOON: 'option-12',
    THURSDAY_MORNING: 'option-13',
    THURSDAY_AFTERNOON: 'option-14',
    FRIDAY_MORNING: 'option-15',
    FRIDAY_AFTERNOON: 'option-16',
    NO_PREFERENCE: 'option-17',
  },
  [FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]: {
    MONDAY_MORNING: 'option-18',
    MONDAY_AFTERNOON: 'option-19',
    TUESDAY_MORNING: 'option-20',
    TUESDAY_AFTERNOON: 'option-21',
    WEDNESDAY_MORNING: 'option-22',
    WEDNESDAY_AFTERNOON: 'option-23',
    THURSDAY_MORNING: 'option-24',
    THURSDAY_AFTERNOON: 'option-25',
    FRIDAY_MORNING: 'option-26',
    FRIDAY_AFTERNOON: 'option-27',
    NO_PREFERENCE: 'option-28',
  },
  [FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING]: {
    yes: 29,
    no: 30,
    noPreference: 31,
  },
  [FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING]: {
    yes: 32,
    no: 33,
    noPreference: 34,
  },
  [FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER]: {
    male: 35,
    female: 36,
    noPreference: 37,
  },
};

export const FIELD_ADDITIONAL_CONTENT = {
  [FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]:
    'Select the days and times of day you want to go to your appointments.',
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES]:
    'Select the days and times of day you want us to contact you.',
};

export const FIELD_OPTION_IDS_INVERTED = {
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]: {
    'option-6': 'No preference',
    'option-5': 'Contact email',
    'option-38': 'Phone call: home phone',
    'option-1': 'Phone call: mobile phone',
    'option-39': 'Phone call: work phone',
    'option-2': 'Text message: mobile phone',
    'option-3': 'Secure message',
    'option-4': 'Mailing address',
  },
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES]: {
    'option-7': 'MONDAY_MORNING',
    'option-8': 'MONDAY_AFTERNOON',
    'option-9': 'TUESDAY_MORNING',
    'option-10': 'TUESDAY_AFTERNOON',
    'option-11': 'WEDNESDAY_MORNING',
    'option-12': 'WEDNESDAY_AFTERNOON',
    'option-13': 'THURSDAY_MORNING',
    'option-14': 'THURSDAY_AFTERNOON',
    'option-15': 'FRIDAY_MORNING',
    'option-16': 'FRIDAY_AFTERNOON',
    'option-17': 'No preference',
  },
  [FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]: {
    'option-18': 'MONDAY_MORNING',
    'option-19': 'MONDAY_AFTERNOON',
    'option-20': 'TUESDAY_MORNING',
    'option-21': 'TUESDAY_AFTERNOON',
    'option-22': 'WEDNESDAY_MORNING',
    'option-23': 'WEDNESDAY_AFTERNOON',
    'option-24': 'THURSDAY_MORNING',
    'option-25': 'THURSDAY_AFTERNOON',
    'option-26': 'FRIDAY_MORNING',
    'option-27': 'FRIDAY_AFTERNOON',
    'option-28': 'No preference',
  },
  [FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING]: {
    'option-29': 'Yes',
    'option-30': 'No',
    'option-31': 'No preference',
  },
  [FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING]: {
    'option-32': 'Yes',
    'option-33': 'No',
    'option-34': 'No preference',
  },
  [FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER]: {
    'option-35': 'Male',
    'option-36': 'Female',
    'option-37': 'No preference',
  },
};

export const FIELD_OPTION_IN_COPY = {
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]: {
    'option-6': 'no preference',
    'option-5': 'contact email',
    'option-38': 'home phone number',
    'option-1': 'mobile phone number',
    'option-39': 'work phone number',
    'option-2': 'mobile phone number',
    'option-3': 'secure message',
    'option-4': 'mailing address',
  },
  // Additional fields can be added here as needed
};

export const FIELD_TITLES = {
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]:
    "What's the best way to contact you to schedule your appointments?",
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES]:
    'When do you want us to contact you to schedule your appointments?',
  [FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING]:
    'Do you want help scheduling your appointments?',
  [FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]:
    'When do you want to go to your appointments?',
  [FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER]:
    'Do you prefer a male or female provider?',
  [FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING]:
    'Do you want help choosing your provider?',
};

export const FIELD_IDS = {
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]: 'preferred-contact-method',
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES]: 'preferred-contact-times',
  [FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING]:
    'needs-help-scheduling-appointments',
  [FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]:
    'preferred-appointment-times',
  [FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER]: 'preferred-provider-gender',
  [FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING]: 'needs-help-choosing-provider',
};

export const FIELD_SECTION_HEADERS = {
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]: 'Contact preferences',
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES]: 'Contact preferences',
  [FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING]: 'Appointment preferences',
  [FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]: 'Appointment preferences',
  [FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER]: 'Provider preferences',
  [FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING]: 'Provider preferences',
};

export const ANALYTICS_FIELD_MAP = {
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]: 'preferred-contact-method',
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES]: 'preferred-contact-times',
  [FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING]:
    'needs-help-scheduling-appointments',
  [FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]:
    'preferred-appointment-times',
  [FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER]: 'preferred-provider-gender',
  [FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING]: 'needs-help-choosing-provider',
};

export const API_ROUTES = {
  SCHEDULING_PREFERENCES: '/profile/scheduling_preferences',
};

const BASE_PATH = '/profile/health-care-settings/scheduling-preferences';
export const SCHEDULING_PREF_PATHS = {
  CONTACT_METHOD: `${BASE_PATH}/contact-method`,
  CONTACT_TIMES: `${BASE_PATH}/contact-times`,
  APPOINTMENT_TIMES: `${BASE_PATH}/appointment-times`,
};

export const errorMessages = {
  noPreferenceSelected: 'Select a scheduling preference',
};
