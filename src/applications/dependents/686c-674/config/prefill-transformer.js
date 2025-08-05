/* vets-api/config/form_profile_mappings/10182.yml
nonPrefill:
  veteranSsnLastFour:
  veteranVaFileNumberLastFour:
*/

export default function prefillTransformer(pages, formData, metadata) {
  const { veteranSsnLastFour = '', veteranVaFileNumberLastFour = '' } =
    formData?.nonPrefill || {};
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
      },
      veteranContactInformation: {
        veteranAddress: {
          isMilitary,
          country: address.countryName || 'USA',
          street: address.addressLine1 || '',
          street2: address.addressLine2 || '',
          street3: address.addressLine3 || '',
          city: address.city || '',
          state: address.stateCode || '',
          postalCode: address.zipCode || '',
        },
        phoneNumber: contact.phoneNumber || '',
        emailAddress: contact.emailAddress || '',
      },
      useV2: true,
      daysTillExpires: 365,
    },
    metadata,
  };
}
