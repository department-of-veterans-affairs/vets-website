/* vets-api/config/form_profile_mappings/20-0996.yml
data:
  attributes:
    veteran:
      address:
        zipCode5:
      phone:
        phoneNumber:
      emailAddressText:
nonPrefill:
  veteranAddress:
    street:
    street2:
    city:
    state:
    country:
    postal_code: // not used
    zip_code: // not used
  veteranSsnLastFour:
  veteranVaFileNumberLastFour:
*/

export default function prefillTransformer(pages, formData, metadata) {
  const {
    address: { zipCode5 = '' } = {},
    phone: { phoneNumber = '' } = {},
    emailAddressText = '',
  } = formData?.data?.attributes?.veteran || {};
  const {
    veteranAddress: {
      street = '',
      street2 = '',
      city = '',
      state = '',
      country = '',
    } = {},
    veteranSsnLastFour = '',
    veteranVaFileNumberLastFour = '',
  } = formData?.nonPrefill || {};

  return {
    pages,
    formData: {
      veteran: {
        street,
        street2,
        city,
        state,
        country,
        zipCode5,
        phoneNumber,
        emailAddress: emailAddressText,
        ssnLastFour: veteranSsnLastFour,
        vaFileLastFour: veteranVaFileNumberLastFour,
      },
    },
    metadata,
  };
}
