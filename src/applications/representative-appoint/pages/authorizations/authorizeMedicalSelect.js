import React from 'react';
import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { authorizationNote } from '../../content/authorizeMedical';
import { MedicalSelectAuthorizationDescription } from '../../components/MedicalSelectAuthorizationDescription';

export const uiSchema = {
  'ui:description': ({ formData }) => (
    <MedicalSelectAuthorizationDescription formData={formData} />
  ),
  authorizeMedicalSelectCheckbox: checkboxGroupUI({
    title: 'Select the types of records they can access',
    required: true,
    labelHeaderLevel: '',
    tile: false,
    uswds: true,
    labels: {
      alcoholRecords: 'Alcoholism and alcohol abuse records',
      drugAbuseRecords: 'Drug abuse records',
      HIVRecords: 'HIV (human immunodeficiency virus) records',
      sickleCellRecords: 'Sickle cell anemia records',
    },
    errorMessages: {
      required: 'Please select at least one option',
    },
  }),
  'view:authorizationNote4': {
    'ui:description': authorizationNote,
  },
};

export const schema = {
  type: 'object',
  required: ['authorizeMedicalSelectCheckbox'],
  properties: {
    'view:authorizeRecordsSelect': {
      type: 'object',
      properties: {},
    },
    authorizeMedicalSelectCheckbox: checkboxGroupSchema(
      Object.keys({
        alcoholRecords: 'Alcoholism and alcohol abuse records',
        drugAbuseRecords: 'Drug abuse records',
        HIVRecords: 'HIV (human immunodeficiency virus) records',
        sickleCellRecords: 'Sickle cell anemia records',
      }),
    ),
  },
};
