import React from 'react';
import fullSchema from 'vets-json-schema/dist/28-1900-schema.json';
import { addressUiSchema } from 'applications/vre/definitions/profileAddress';

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
    'ui:title': 'How many years of education do you have?',
    'ui:description': (
      <p className="vads-u-margin--0">
        (include K-12 and each year of college)
      </p>
    ),
    'ui:errorMessages': {
      pattern: 'Please enter a number',
    },
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
    },
  },
};
