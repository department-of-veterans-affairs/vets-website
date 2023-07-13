import React from 'react';
import fullSchema from 'vets-json-schema/dist/28-1900-schema.json';
import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';

const { newAddress, isMoving, yearsOfEducation } = fullSchema.properties;

const checkboxTitle =
  'I will live on a United States military base outside of the U.S.';

const newAddressUi = addressUiSchema(
  'newAddress',
  checkboxTitle,
  formData => formData?.isMoving,
);

export const schema = {
  type: 'object',
  properties: {
    yearsOfEducation,
    isMoving,
    newAddress,
  },
};

export const uiSchema = {
  'ui:title': 'Additional Information',
  yearsOfEducation: {
    'ui:title': 'What’s your highest level of education?',
    'ui:required': () => true,
  },
  isMoving: {
    'ui:widget': 'yesNo',
    'ui:title': (
      <p className="vads-u-margin--0">
        Are you moving in the <strong>next 30 days?</strong>
      </p>
    ),
    'ui:required': () => true,
  },
  newAddress: {
    'ui:title': (
      <p className="vads-u-font-size--md vads-u-color--gray-dark vads-u-font-weight--bold">
        Your new address
      </p>
    ),
    ...newAddressUi,
    'ui:options': {
      expandUnder: 'isMoving',
      expandUnderCondition: true,
      updateSchema: (formData, formSchema) => {
        // Clear out required fields here to avoid silent validation errors for hidden fields.
        if (!formData.isMoving && formData.newAddress) {
          return { ...formSchema, required: [] };
        }
        return formSchema;
      },
    },
  },
};
