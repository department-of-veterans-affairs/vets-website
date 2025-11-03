import { NETWORTH_VALUE } from './constants';
import { processDependents } from '../utils/processDependents';

export default function prefillTransformer(pages, formData, metadata) {
  const {
    veteranSsnLastFour = '',
    veteranVaFileNumberLastFour = '',
    isInReceiptOfPension = -1,
    netWorthLimit = NETWORTH_VALUE,
    dependents = {},
  } = formData?.nonPrefill || {};
  const contact = formData?.veteranContactInformation || {};
  const address = contact.veteranAddress || {};
  const isMilitary =
    ['APO', 'FPO', 'DPO'].includes((address?.city || '').toUpperCase()) ||
    false;

  const { hasError, awarded, notAwarded } = processDependents({
    dependents,
    isPrefill: true,
  });

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
          country: address.country || address.countryName || 'USA',
          street: address.street || address.addressLine1 || '',
          street2: address.street2 || address.addressLine2 || '',
          street3: address.street3 || address.addressLine3 || '',
          city: address.city || '',
          state: address.state || address.stateCode || '',
          postalCode: address.postalCode || address.zipCode || '',
        },
        phoneNumber: contact.phoneNumber || null,
        emailAddress: contact.emailAddress || null,
      },
      dependents: {
        hasError,
        hasDependents: awarded.length > 0,
        awarded,
        notAwarded,
      },
      useV2: true,
      netWorthLimit,
      daysTillExpires: 365,
    },
    metadata,
  };
}
