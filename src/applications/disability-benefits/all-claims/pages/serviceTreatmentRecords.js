import _ from 'platform/utilities/data';

import { serviceTreatmentRecordsSubmitLater } from '../content/serviceTreatmentRecords';

export const uiSchema = {
  'view:uploadServiceTreatmentRecordsQualifier': {
    'view:hasServiceTreatmentRecordsToUpload': {
      'ui:title': `Do you want to upload your service treatment records? (You’ll
        have a chance to upload your medical records later in the application.)`,
      'ui:widget': 'yesNo',
      'ui:options': {
        labels: {
          Y: 'Yes',
          N: 'No, I will submit them later.',
        },
        widgetProps: {
          N: {
            'aria-describedby': 'submit-str-asap',
          },
        },
      },
    },
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
        'view:hasServiceTreatmentRecordsToUpload': {
          type: 'boolean',
        },
      },
    },
    'view:serviceTreatmentRecordsSubmitLater': {
      type: 'object',
      properties: {},
    },
  },
};
