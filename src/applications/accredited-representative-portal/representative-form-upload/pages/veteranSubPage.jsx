import {
  titleUI,
  firstNameLastNameNoSuffixUI,
  ssnUI,
  dateOfBirthUI,
  addressUI,
  firstNameLastNameNoSuffixSchema,
  ssnSchema,
  dateOfBirthSchema,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

function veteranFormatTitle(name) {
  return `Veteran ${name}`;
}

export const veteranSubPageUI2 = {
  ...titleUI(
    "Veteran's information",
    "If the Veteran's name and postal code here don't match the uploaded PDF, it will cause processing delays",
  ),
  veteranFullName: firstNameLastNameNoSuffixUI(veteranFormatTitle),
  veteranSsn: ssnUI('Veteran SSN'),
  veteranDateOfBirth: dateOfBirthUI({
    title: 'Veteran Date of Birth',
  }),
  address: addressUI({
    labels: {
      postalCode: 'Postal code',
    },
    omit: [
      'country',
      'city',
      'isMilitary',
      'state',
      'street',
      'street2',
      'street3',
    ],
    required: true,
  }),
};

export const veteranSubPageSchema2 = {
  veteranFullName: firstNameLastNameNoSuffixSchema,
  veteranSsn: ssnSchema,
  veteranDateOfBirth: dateOfBirthSchema,
  address: addressSchema({
    omit: [
      'country',
      'city',
      'isMilitary',
      'state',
      'street',
      'street2',
      'street3',
    ],
  }),
};
