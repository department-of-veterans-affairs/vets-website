import { errorMessages } from '../content/contactInfo';

export const contactInfoValidation = (errors = {}, _fieldData, formData) => {
  const { veteran = {}, homeless } = formData || {};
  if (!veteran.email) {
    errors.addError?.(errorMessages.missingEmail);
  }
  if (!veteran.phone?.phoneNumber) {
    errors.addError?.(errorMessages.missingMobilePhone);
  }
  if (!homeless && !veteran.address?.addressLine1) {
    errors.addError?.(errorMessages.missingMailingAddress);
  }
};
