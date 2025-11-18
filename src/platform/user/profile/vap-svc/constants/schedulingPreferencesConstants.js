export const FIELD_NAMES = {
  CONTACT_PREFERENCE_1: 'preferenceContactMethod',
  CONTACT_PREFERENCE_2: 'preferenceContactTimes',
  APPOINTMENT_PREFERENCE_1: 'needsHelpSchedulingAppointments',
  APPOINTMENT_PREFERENCE_2: 'preferredAppointmentTimes',
  PROVIDER_PREFERENCE_1: 'preferredProviderGender',
  PROVIDER_PREFERENCE_2: 'needsHelpChoosingProvider',
};

export const FIELD_TITLES = {
  [FIELD_NAMES.CONTACT_PREFERENCE_1]:
    "What's the best way to contact you to schedule your appointments?",
  [FIELD_NAMES.CONTACT_PREFERENCE_2]:
    'When do you want us to contact you to schedule your appointments?',
  [FIELD_NAMES.APPOINTMENT_PREFERENCE_1]:
    'Do you want help scheduling your appointments?',
  [FIELD_NAMES.APPOINTMENT_PREFERENCE_2]:
    'When do you want to go to your appointments?',
  [FIELD_NAMES.PROVIDER_PREFERENCE_1]:
    'Do you prefer a male or female provider?',
  [FIELD_NAMES.PROVIDER_PREFERENCE_2]:
    'Do you want help choosing your provider?',
};

export const FIELD_IDS = {
  [FIELD_NAMES.CONTACT_PREFERENCE_1]: 'preferred-contact-method',
  [FIELD_NAMES.CONTACT_PREFERENCE_2]: 'preferred-contact-times',
  [FIELD_NAMES.APPOINTMENT_PREFERENCE_1]: 'needs-help-scheduling-appointments',
  [FIELD_NAMES.APPOINTMENT_PREFERENCE_2]: 'preferred-appointment-times',
  [FIELD_NAMES.PROVIDER_PREFERENCE_1]: 'preferred-provider-gender',
  [FIELD_NAMES.PROVIDER_PREFERENCE_2]: 'needs-help-choosing-provider',
};

export const FIELD_SECTION_HEADERS = {
  [FIELD_NAMES.CONTACT_PREFERENCE_1]: 'Contact preferences',
  [FIELD_NAMES.CONTACT_PREFERENCE_2]: 'Contact preferences',
  [FIELD_NAMES.APPOINTMENT_PREFERENCE_1]: 'Appointment preferences',
  [FIELD_NAMES.APPOINTMENT_PREFERENCE_2]: 'Appointment preferences',
  [FIELD_NAMES.PROVIDER_PREFERENCE_1]: 'Provider preferences',
  [FIELD_NAMES.PROVIDER_PREFERENCE_2]: 'Provider preferences',
};

export const ANALYTICS_FIELD_MAP = {
  [FIELD_NAMES.CONTACT_PREFERENCE_1]: 'preferred-contact-method',
  [FIELD_NAMES.CONTACT_PREFERENCE_2]: 'preferred-contact-times',
  [FIELD_NAMES.APPOINTMENT_PREFERENCE_1]: 'needs-help-scheduling-appointments',
  [FIELD_NAMES.APPOINTMENT_PREFERENCE_2]: 'preferred-appointment-times',
  [FIELD_NAMES.PROVIDER_PREFERENCE_1]: 'preferred-provider-gender',
  [FIELD_NAMES.PROVIDER_PREFERENCE_2]: 'needs-help-choosing-provider',
};

export const API_ROUTES = {
  SCHEDULING_PREFERENCES: '/profile/scheduling_preferences',
};
