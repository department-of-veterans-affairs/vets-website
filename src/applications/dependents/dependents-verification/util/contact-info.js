export const contactInfoXref = {
  address: {
    label: 'mailing address',
    path: 'mailing-address',
  },
  phone: {
    label: 'home phone number',
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

export const saveEditContactInformation = (name, action) => {
  sessionStorage.setItem(EDIT_KEY, `${name},${action}`);
};

export const getEditContactInformation = () => {
  const [name, action] = (sessionStorage.getItem(EDIT_KEY) || '')
    .trim()
    .split(',');
  return { name, action };
};

export const removeEditContactInformation = () => {
  sessionStorage.removeItem(EDIT_KEY);
};

export const convertPhoneObjectToString = phoneObj => {
  if (!phoneObj) return '';
  const { areaCode, phoneNumber, countryCode, isInternational } = phoneObj;
  return areaCode && phoneNumber
    ? `${isInternational ? countryCode : ''}${areaCode}${phoneNumber}`
    : '';
};
