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
    [`optionId-${1}`]: 'TELEPHONE_MOBILE',
    [`optionId-${38}`]: 'TELEPHONE_HOME',
    [`optionId-${39}`]: 'TELEPHONE_WORK',
    [`optionId-${2}`]: 'TEXT_MESSAGE',
    [`optionId-${3}`]: 'SECURE_MESSAGE',
    [`optionId-${4}`]: 'US_POST',
    [`optionId-${5}`]: 'EMAIL',
    [`optionId-${6}`]: 'NO_PREFERENCE',
  },
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES]: {
    [`optionId-${7}`]: 'MONDAY_MORNING',
    [`optionId-${8}`]: 'MONDAY_AFTERNOON',
    [`optionId-${9}`]: 'TUESDAY_MORNING',
    [`optionId-${10}`]: 'TUESDAY_AFTERNOON',
    [`optionId-${11}`]: 'WEDNESDAY_MORNING',
    [`optionId-${12}`]: 'WEDNESDAY_AFTERNOON',
    [`optionId-${13}`]: 'THURSDAY_MORNING',
    [`optionId-${14}`]: 'THURSDAY_AFTERNOON',
    [`optionId-${15}`]: 'FRIDAY_MORNING',
    [`optionId-${16}`]: 'FRIDAY_AFTERNOON',
    [`optionId-${17}`]: 'NO_PREFERENCE',
  },
  [FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]: {
    [`optionId-${18}`]: 'MONDAY_MORNING',
    [`optionId-${19}`]: 'MONDAY_AFTERNOON',
    [`optionId-${20}`]: 'TUESDAY_MORNING',
    [`optionId-${21}`]: 'TUESDAY_AFTERNOON',
    [`optionId-${22}`]: 'WEDNESDAY_MORNING',
    [`optionId-${23}`]: 'WEDNESDAY_AFTERNOON',
    [`optionId-${24}`]: 'THURSDAY_MORNING',
    [`optionId-${25}`]: 'THURSDAY_AFTERNOON',
    [`optionId-${26}`]: 'FRIDAY_MORNING',
    [`optionId-${27}`]: 'FRIDAY_AFTERNOON',
    [`optionId-${28}`]: 'NO_PREFERENCE',
  },
  [FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING]: {
    [`optionId-${29}`]: 'PREFERS_ASSISTANCE',
    [`optionId-${30}`]: 'NO_ASSISTANCE',
    [`optionId-${31}`]: 'NO_PREFERENCE',
  },
  [FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING]: {
    [`optionId-${32}`]: 'PREFERS_ASSISTANCE',
    [`optionId-${33}`]: 'NO_ASSISTANCE',
    [`optionId-${34}`]: 'NO_PREFERENCE',
  },
  [FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER]: {
    [`optionId-${35}`]: 'MALE',
    [`optionId-${36}`]: 'FEMALE',
    [`optionId-${37}`]: 'NO_PREFERENCE',
  },
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
