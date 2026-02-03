/* eslint-disable no-console */
import { formatPhone } from '../utils/helpers';

export default function prefillTransformer(pages, formData, metadata, state) {
  const { user } = state || {};
  const { profile } = user || {};
  const { vapContactInfo } = profile || {};
  const {
    mailingAddress,
    email: profileEmail,
    mobilePhone: profileMobilePhone,
  } = vapContactInfo || {};
  const phoneNumber = profileMobilePhone?.phoneNumber
    ? `${profileMobilePhone.areaCode || ''}${profileMobilePhone.phoneNumber}`
    : undefined;
  // Build the transformed form data at root level
  const transformedFormData = {
    // Preserve any existing form data
    ...formData,
    // Add login state tracking to formData for use in depends fields
    'view:loginState': {
      isLoggedIn: state?.user?.login?.currentlyLoggedIn || false,
    },
    // Prefill mailing address from VA Profile if available
    ...(mailingAddress && {
      applicantMailingAddress: {
        street: mailingAddress.addressLine1 || '',
        street2: mailingAddress.addressLine2 || '',
        city: mailingAddress.city || '',
        state: mailingAddress.stateCode || '',
        postalCode: mailingAddress.zipCode || '',
        country: mailingAddress.countryCodeIso3 || 'USA',
      },
    }),
    ...{
      email: profileEmail?.emailAddress || '',
      phoneNumber: phoneNumber ? formatPhone(phoneNumber) : '',
    },
  };

  return {
    pages,
    formData: transformedFormData,
    metadata,
  };
}
