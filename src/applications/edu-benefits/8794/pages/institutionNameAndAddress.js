import React from 'react';
import { useSelector } from 'react-redux';
import {
  addressSchema,
  addressUI,
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const noSpaceOnlyPattern = '^(?!\\s*$).+';

const DynamicMilitaryInfo = () => {
  const formData = useSelector(state => state.form?.data);
  const isMilitary = formData?.institutionDetails?.isMilitary;

  const checkedText = `The United States is automatically chosen as your country if you live on a military base outside of the country.`;
  const uncheckedText = `The United States is automatically chosen as your country if your institution is on a military base outside of the U.S.`;

  return (
    <va-additional-info trigger="Learn more about military base addresses">
      <span>{isMilitary ? checkedText : uncheckedText}</span>
    </va-additional-info>
  );
};

const uiSchema = {
  institutionDetails: {
    ...titleUI('Please provide your institution’s name and address'),

    institutionName: textUI({
      title: 'Name of institution or training facility',
      errorMessages: {
        required: 'Enter the name of your institution or training facility',
        pattern: 'You must provide a response',
      },
    }),

    ...addressUI({
      labels: {
        street: 'Street address',
        street2: 'Street address line 2',
        street3: 'Street address line 3',
        militaryCheckbox:
          'My institution is on a United States military base outside of the U.S.',
      },
    }),

    'view:militaryBaseDescription': {
      'ui:description': <DynamicMilitaryInfo />,
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    institutionDetails: {
      type: 'object',
      properties: {
        institutionName: { ...textSchema, pattern: noSpaceOnlyPattern },
        isMilitary: addressSchema().properties.isMilitary,
        'view:militaryBaseDescription': {
          type: 'object',
          properties: {},
        },
        country: addressSchema().properties.country,
        street: addressSchema().properties.street,
        street2: addressSchema().properties.street2,
        street3: addressSchema().properties.street3,
        city: addressSchema().properties.city,
        state: addressSchema().properties.state,
        postalCode: addressSchema().properties.postalCode,
      },
      required: [
        'institutionName',
        'street',
        'city',
        'state',
        'postalCode',
        'country',
      ],
    },
  },
};

export { uiSchema, schema };
