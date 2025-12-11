export const contactInfoXref = {
  address: {
    label: 'mailing address',
    path: 'mailing-address',
  },
  phone: {
    label: ' phone number',
    path: 'phone',
  },
  internationalPhone: {
    label: 'international phone number',
    path: 'international-phone',
  },
  email: {
    label: 'email address',
    path: 'email',
  },
};

const EDIT_KEY = 'editContactInformation';

/**
 * Set session storage item to track contact info edits to then perform the
 * appropriate action on main contact information page
 * @param {string} name - contact info field name
 * @param {string} action - action that was taken (update or cancel)
 * @returns {void}
 */
export const saveEditContactInformation = (name, action) => {
  sessionStorage.setItem(EDIT_KEY, `${name},${action}`);
};

/**
 * Get contact info edit name and action from session storage to determine
 * what action to take on main contact information page - show or not show
 * success message, and manage focus
 * @typedef {object} SaveEditContactInformation
 * @property {string} name - contact info field name
 * @property {string} action - action that was taken (update or cancel)
 *
 * @returns {SaveEditContactInformation} - contact info edit name and action
 */
export const getEditContactInformation = () => {
  const [name, action] = (sessionStorage.getItem(EDIT_KEY) || '')
    .trim()
    .split(',');
  return { name, action };
};

/**
 * Remove contact info edit session storage item
 * @returns {void}
 */
export const removeEditContactInformation = () => {
  sessionStorage.removeItem(EDIT_KEY);
};

/**
 * Converts phone object to string for display purposes
 * @typedef {object} PhoneObject
 * @property {string} areaCode - phone area code
 * @property {string} phoneNumber - phone number
 * @property {string} countryCode - country code for international numbers
 * @property {boolean} isInternational - is an international number
 *
 * @param {PhoneObject} phoneObj - phone object to process
 * @returns {string} - formatted phone number string
 */
export const convertPhoneObjectToString = phoneObj => {
  if (!phoneObj) return '';
  const { areaCode, phoneNumber, countryCode, isInternational } = phoneObj;
  return areaCode && phoneNumber
    ? `${isInternational ? countryCode : ''}${areaCode}${phoneNumber}`
    : '';
};
