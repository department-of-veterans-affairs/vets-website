import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { isUnder65, requiresEmploymentHistory } from './helpers';
import {
  showMultiplePageResponse,
  showPdfFormAlignment,
} from '../../../helpers';

const { currentEmployment } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Current employment',
  path: 'employment/current',
  depends: formData => {
    if (!showMultiplePageResponse()) {
      return showPdfFormAlignment()
        ? requiresEmploymentHistory(formData)
        : isUnder65(formData);
    }
    return false;
  },
  uiSchema: {
    ...titleUI('Current employment'),
    currentEmployment: yesNoUI({
      title: 'Are you currently employed?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['currentEmployment'],
    properties: {
      currentEmployment,
    },
  },
};
