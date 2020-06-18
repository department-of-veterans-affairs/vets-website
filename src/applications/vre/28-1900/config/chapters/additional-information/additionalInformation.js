import React from 'react';
import {
  buildAddressSchema,
  addressUISchema,
} from '../../../../../disability-benefits/686c-674/config/address-schema';
import { EDUCATION_LEVELS } from '../../constants';

const newAddress = buildAddressSchema(true);
// reset boolean type
newAddress.properties['view:livesOnMilitaryBase'] = {
  type: 'boolean',
};

const newAddressUI = addressUISchema(
  true,
  'newAddress',
  formData => formData.isMoving,
);
// reset title for checkbox
newAddressUI['view:livesOnMilitaryBase']['ui:title'] =
  'I will live on a United States military base outside of the U.S.';

const educationLabels = Object.entries(EDUCATION_LEVELS).map(
  ([label, title]) => label,
);
const educationTitles = Object.entries(EDUCATION_LEVELS).map(
  ([label, title]) => title,
);

export const schema = {
  type: 'object',
  properties: {
    educationLevel: {
      type: 'string',
      enum: educationLabels,
      enumNames: educationTitles,
    },
    isMoving: {
      type: 'boolean',
    },
    newAddress,
  },
};

export const uiSchema = {
  'ui:description': (
    <p>
      <strong>Giving this information is optional.</strong> If you skip this
      page, and we don't have this information in your record, we may ask you
      for this again when we process your application.
    </p>
  ),
  educationLevel: {
    'ui:title': 'Highest education level',
  },
  isMoving: {
    'ui:widget': 'yesNo',
    'ui:title': (
      <p>
        Are you moving in the <strong>next 30 days?</strong>
      </p>
    ),
  },
  newAddress: {
    'ui:title': (
      <p className="vads-u-font-size--md vads-u-color--gray-dark vads-u-font-weight--bold">
        Your new address
      </p>
    ),
    ...newAddressUI,
    'ui:options': {
      expandUnder: 'isMoving',
      expandUnderCondition: true,
    },
  },
};
