import {
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { showMedicalEvidenceClarification } from '../../../helpers';

const { isOver65 } = fullSchemaPensions.properties;

const path = showMedicalEvidenceClarification()
  ? 'medical/history/age'
  : 'temporarily-hidden-tell-us-your-age';

/** @type {PageSchema} */
export default {
  title: 'Your age',
  path,
  depends: () => showMedicalEvidenceClarification(),
  uiSchema: {
    ...titleUI('Tell us your age'),
    isOver65: yesNoUI({
      title: 'Are you at least 65 years old?',
      hint:
        "Your answer to this question helps us determine if you're eligible for Veterans Pension benefits. We consider your age, income, and medical history in our determination. If you're under 65 years old, you may still be eligible.",
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
