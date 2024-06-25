import { checkboxGroupUI } from 'platform/forms-system/src/js/web-component-patterns';

import { checkboxGroupSchemaWithReviewLabels } from '../utilities/helpers';

import { authorizeMedicalSelect } from '../content/authorizeMedicalSelect';
import { saveYourApplication } from '../content/saveYourApplication';

export const uiSchema = {
  'view:saveYourApplication': {
    'ui:description': saveYourApplication,
  },
  'view:authorizeMedicalSelect': {
    'ui:description': authorizeMedicalSelect,
  },
  'view:authorizeRecordsCheckbox': {
    ...checkboxGroupUI({
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
    'ui:options': {
      classNames: 'vads-u-margin-top--0',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:saveYourApplication': {
      type: 'object',
      properties: {},
    },
    'view:authorizeMedicalSelect': {
      type: 'object',
      properties: {},
    },
    'view:authorizeRecordsCheckbox': {
      ...checkboxGroupSchemaWithReviewLabels([
        'alcoholRecords',
        'drugAbuseRecords',
        'HIVRecords',
        'sickleCellRecords',
      ]),
    },
  },
};
