import React from 'react';

import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
  titleUI,
  titleSchema,
  descriptionUI,
  descriptionSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import ProfileNotUpdatedNote from '../../components/ProfileNotUpdatedNote';
import { preparerIsVeteran } from '../../utilities/helpers';

/** @type {PageSchema} */

export const uiSchema = {
  ...titleUI(
    ({ formData }) =>
      `${
        preparerIsVeteran({ formData }) ? 'Your' : 'Veteran’s'
      } identification information`,
  ),
  ...descriptionUI(
    ({ formData }) =>
      `You must enter a Social Security number or VA file number. In most cases, ${
        preparerIsVeteran({ formData }) ? 'your' : 'the Veteran’s'
      } Social Security and VA file numbers are the same. `,
  ),
  profileNotUpdatedNote: {
    'ui:description': () => (
      <ProfileNotUpdatedNote includePhone includePrefix />
    ),
  },
  veteranSocialSecurityNumber: ssnUI('Social Security number'),
  veteranVAFileNumber: vaFileNumberUI('VA file number'),
  veteranServiceNumber: serviceNumberUI('Service Number'),
};

export const schema = {
  type: 'object',
  required: ['veteranSocialSecurityNumber'],
  properties: {
    titleSchema,
    descriptionSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    veteranSocialSecurityNumber: ssnSchema,
    veteranVAFileNumber: {
      ...vaFileNumberSchema,
      maxLength: 9,
    },
    veteranServiceNumber: {
      ...serviceNumberSchema,
      maxLength: 9,
    },
  },
};
