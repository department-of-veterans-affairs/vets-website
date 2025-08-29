import { NETWORTH_VALUE } from './constants';

export default function prefillTransformer(pages, formData, metadata) {
  const {
    veteranSsnLastFour = '',
    veteranVaFileNumberLastFour = '',
    isInReceiptOfPension = -1,
    netWorthLimit = NETWORTH_VALUE,
  } = formData?.nonPrefill || {};
  const contact = formData?.veteranContactInformation || {};
  const address = contact.veteranAddress || {};
  const isMilitary =
    ['APO', 'FPO', 'DPO'].includes((address?.city || '').toUpperCase()) ||
    false;

  return {
    pages,
    formData: {
      veteranInformation: {
        ...formData?.veteranInformation,
        ssnLastFour: veteranSsnLastFour,
        vaFileLastFour: veteranVaFileNumberLastFour,
        isInReceiptOfPension,
      },
      veteranContactInformation: {
        veteranAddress: {
          isMilitary,
          country: address.countryName || 'USA',
          street: address.addressLine1 || null,
          street2: address.addressLine2 || null,
          street3: address.addressLine3 || null,
          city: address.city || null,
          state: address.stateCode || null,
          postalCode: address.zipCode || null,
        },
        phoneNumber: contact.phoneNumber || null,
        emailAddress: contact.emailAddress || null,
      },
      useV2: true,
      netWorthLimit,
      daysTillExpires: 365,
    },
    metadata,
  };
}
