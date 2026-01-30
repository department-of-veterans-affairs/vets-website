import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { standardTitle } from '../content/form0781';
import { evidenceRequestAdditionalInformation } from '../content/evidenceRequest';

export const uiSchema = {
  'ui:title': standardTitle(
    'Medical records that support your disability claim',
  ),
  'view:hasMedicalRecords': yesNoUI({
    title:
      'Are there medical records related to your claim that you’d like us to access on your behalf from VA or private medical centers?',
    hint:
      'If you select “Yes,” we’ll request these records from VA or private medical centers. Or you can upload copies of your private medical records.',
  }),
  additionalInformation: {
    'ui:description': evidenceRequestAdditionalInformation,
  },
};

export const schema = {
  type: 'object',
  required: ['view:hasMedicalRecords'],
  properties: {
    'view:hasMedicalRecords': yesNoSchema,
    additionalInformation: {
      type: 'object',
      properties: {},
    },
  },
};
