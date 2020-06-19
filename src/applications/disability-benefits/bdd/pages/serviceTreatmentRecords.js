import { ancillaryFormUploadUi } from '../../all-claims/utils';
import _ from 'platform/utilities/data';
import { UploadDescription } from '../../all-claims/content/fileUploadDescriptions';
import { serviceTreatmentRecordsSubmitLater } from '../content/serviceTreatmentRecords';
// import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import fullSchema from '../../all-claims/config/schema';

const fileUploadUi = ancillaryFormUploadUi(
  'Upload your service treatment records',
  '',
  {
    attachmentId: '',
    addAnotherLabel: 'Add another document',
  },
);

const { serviceTreatmentRecordsAttachments } = fullSchema.properties;

export const uiSchema = {
  'view:uploadServiceTreatmentRecordsQualifier': {
    'view:hasServiceTreatmentRecordsToUpload': {
      'ui:title': 'Do you want to upload your service treatment records?',
      'ui:widget': 'yesNo',
      'ui:options': {
        labels: {
          Y: 'Yes',
          N: 'No, I will submit them later.',
        },
        // Force ReviewFieldTemplate to wrap this component in a <dl>
        useDlWrap: true,
      },
    },
  },
  serviceTreatmentRecordsAttachments: {
    ...fileUploadUi,
    'ui:options': {
      ...fileUploadUi['ui:options'],
      expandUnder: 'view:uploadServiceTreatmentRecordsQualifier',
      expandUnderCondition: data =>
        _.get('view:hasServiceTreatmentRecordsToUpload', data, false),
    },
    'ui:description': UploadDescription,
    'ui:required': data =>
      _.get('view:hasServiceTreatmentRecordsToUpload', data, false),
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
    serviceTreatmentRecordsAttachments,
    'view:serviceTreatmentRecordsSubmitLater': {
      type: 'object',
      properties: {},
    },
  },
};
