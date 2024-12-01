import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { showMedicalEvidenceClarification } from '../../../helpers';

const { isOver65 } = fullSchemaPensions.properties;

// TODO: Remove this page when pension_medical_evidence_clarification flipper is removed

const path = !showMedicalEvidenceClarification()
  ? 'medical/history/age'
  : 'temporarily-hidden-age';

/** @type {PageSchema} */
export default {
  title: 'Age',
  path,
  depends: () => !showMedicalEvidenceClarification(),
  uiSchema: {
    isOver65: yesNoUI({
      title: 'Are you 65 years old or older?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['isOver65'],
    properties: {
      isOver65,
    },
  },
};
