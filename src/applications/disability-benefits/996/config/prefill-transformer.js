/* vets-api/config/form_profile_mappings/20-0996.yml
data:
  attributes:
    veteran:
      address:
        zipCode5:
      phone:
        areaCode:
        phoneNumber:
      emailAddressText:
nonPrefill:
  veteranAddress:
    street:
    street2:
    street3:
    city:
    state:
    country:
    postalCode: // not used
  veteranSsnLastFour:
  veteranVaFileNumberLastFour:
*/

export default function prefillTransformer(pages, formData, metadata) {
  const {
    address: { zipCode5 = '' } = {},
    phone: { areaCode, phoneNumber } = {},
    emailAddressText = '',
  } = formData?.data?.attributes?.veteran || {};
  const {
    veteranAddress: {
      street = '',
      street2 = '',
      street3 = '',
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
        street3,
        city,
        state,
        country,
        zipCode5,
        phoneNumber: `${areaCode || ''}${phoneNumber || ''}`,
        emailAddress: emailAddressText,
        ssnLastFour: veteranSsnLastFour,
        vaFileLastFour: veteranVaFileNumberLastFour,
      },
    },
    metadata,
  };
}
