import { errorMessages } from '../content/task-purple/contactInfo';

const validateValue = (errors, value, errorMsg) => {
  if (!value) {
    errors.addError?.(errorMessages[errorMsg]);
  }
};

const validateAddress = (errors, address) => {
  validateValue(errors, address.addressLine1, 'missingMailingAddress');
  if (
    !address.city ||
    (address.countryCodeIso2 === 'US' &&
      (!address.stateCode || address.zipCode?.length !== 5))
  ) {
    errors.addError?.(errorMessages.invalidMailingAddress);
  }
};

// HLR & NOD validation; has homeless question & only mobile phone
export const contactInfoValidation = (errors = {}, _fieldData, formData) => {
  const { veteran = {}, homeless } = formData || {};

  validateValue(errors, veteran.email, 'missingEmail');
  validateValue(errors, veteran.phone?.phoneNumber, 'missingMobilePhone');
  if (!homeless) {
    validateAddress(errors, veteran.address || {});
  }
};

// 995 validation; no homeless question & has both home & mobile phones
export const contactInfo995Validation = (errors = {}, _fieldData, formData) => {
  const { veteran = {} } = formData || {};

  validateValue(errors, veteran.email, 'missingEmail');
  validateValue(errors, veteran.homePhone?.phoneNumber, 'missingHomePhone');
  validateValue(errors, veteran.mobilePhone?.phoneNumber, 'missingMobilePhone');

  validateAddress(errors, veteran.address || {});
};
