import { errorMessages } from '../content/contactInfo';

// HLR & NOD validation; has homeless question & only mobile phone
export const contactInfoValidation = (errors = {}, _fieldData, formData) => {
  const { veteran = {}, homeless } = formData || {};
  if (!veteran.phone?.phoneNumber) {
    errors.addError?.(errorMessages.missingMobilePhone);
  }
  if (!veteran.email) {
    errors.addError?.(errorMessages.missingEmail);
  }
  if (!homeless) {
    const address = veteran.address || {};
    if (!address.addressLine1) {
      errors.addError?.(errorMessages.missingMailingAddress);
    }
    if (
      !address.city ||
      (address.countryCodeIso2 === 'US' &&
        (!address.stateCode || address.zipCode?.length !== 5))
    ) {
      errors.addError?.(errorMessages.invalidMailingAddress);
    }
  }
};

// 995 validation; no homeless question & has both home & mobile phones
export const contactInfo995Validation = (errors = {}, _fieldData, formData) => {
  const { veteran = {} } = formData || {};
  if (!veteran.homePhone?.phoneNumber) {
    errors.addError?.(errorMessages.missingHomePhone);
  }
  if (!veteran.mobilePhone?.phoneNumber) {
    errors.addError?.(errorMessages.missingMobilePhone);
  }
  if (!veteran.email) {
    errors.addError?.(errorMessages.missingEmail);
  }
  const address = veteran.address || {};
  if (!address.addressLine1) {
    errors.addError?.(errorMessages.missingMailingAddress);
  }
  if (
    !address.city ||
    (address.countryCodeIso2 === 'US' &&
      (!address.stateCode || address.zipCode?.length !== 5))
  ) {
    errors.addError?.(errorMessages.invalidMailingAddress);
  }
};
