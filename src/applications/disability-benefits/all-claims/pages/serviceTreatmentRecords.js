import _ from 'platform/utilities/data';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { serviceTreatmentRecordsSubmitLater } from '../content/serviceTreatmentRecords';

export const uiSchema = {
  'view:uploadServiceTreatmentRecordsQualifier': {
    'view:hasServiceTreatmentRecordsToUpload': yesNoUI({
      title: `Do you want to upload your service treatment records? (You’ll
        have a chance to upload your medical records later in the application.)`,
      labels: {
        Y: 'Yes',
        N: 'No, I will submit them later.',
      },
    }),
  },
  'view:serviceTreatmentRecordsSubmitLater': {
    'ui:title': '',
    'ui:description': serviceTreatmentRecordsSubmitLater,
    'ui:options': {
      hideIf: data =>
        _.get(
          'view:uploadServiceTreatmentRecordsQualifier.view:hasServiceTreatmentRecordsToUpload',
          data,
          true,
        ),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:uploadServiceTreatmentRecordsQualifier': {
      required: ['view:hasServiceTreatmentRecordsToUpload'],
      type: 'object',
      properties: {
        'view:hasServiceTreatmentRecordsToUpload': yesNoSchema,
      },
    },
    'view:serviceTreatmentRecordsSubmitLater': {
      type: 'object',
      properties: {},
    },
  },
};
