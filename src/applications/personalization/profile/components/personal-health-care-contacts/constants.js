const CONTACT_TYPE_NAMES = Object.freeze({
  EMERGENCY_CONTACT: 'Emergency Contact',
  OTHER_EMERGENCY_CONTACT: 'Other emergency contact',
  NEXT_OF_KIN: 'Primary Next of Kin',
  OTHER_NEXT_OF_KIN: 'Other Next of Kin',
});

const CONTACT_TYPE_DESCRIPTIONS = Object.freeze({
  EMERGENCY_CONTACT: 'The person we’ll contact in an emergency.',
  OTHER_EMERGENCY_CONTACT:
    'The person we’ll contact if your primary contact isn’t available.',
  NEXT_OF_KIN:
    'The person you want to represent your health care wishes if needed.',
  OTHER_NEXT_OF_KIN:
    'The person you want to represent your health care wishes if your primary contact isn’t available.',
});

const CONTACT_TYPES = Object.entries(CONTACT_TYPE_NAMES).reduce(
  (acc, [key, name]) => {
    acc[name] = CONTACT_TYPE_DESCRIPTIONS[key];
    return acc;
  },
  {},
);

module.exports = {
  CONTACT_TYPE_NAMES,
  CONTACT_TYPE_DESCRIPTIONS,
  CONTACT_TYPES,
};
