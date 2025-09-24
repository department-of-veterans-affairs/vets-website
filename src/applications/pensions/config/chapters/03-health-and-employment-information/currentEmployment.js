import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { hasNoSocialSecurityDisability, isUnder65 } from './helpers';
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
      if (showPdfFormAlignment()) {
        return isUnder65(formData) && !hasNoSocialSecurityDisability(formData);
      }
      return isUnder65(formData);
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
