import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { standardTitle } from '../content/form0781';

export const uiSchema = {
  'ui:title': standardTitle(
    'Medical records that support your disability claim',
  ),
  'view:hasMedicalRecords': yesNoUI({
    title: 'Are there medical records from VA or private?',
  }),
};

export const schema = {
  type: 'object',
  required: ['view:hasMedicalRecords'],
  properties: {
    'view:hasMedicalRecords': yesNoSchema,
  },
};
