import get from 'platform/utilities/data/get';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { marriageTypeLabels } from '../../../labels';
import { requiresSpouseInfo } from './helpers';
import { showMultiplePageResponse } from '../../../helpers';

const otherExplanationRequired = formData =>
  get(['marriageType'], formData) === 'OTHER';

/** @type {PageSchema} */
export default {
  title: 'Marriage Information',
  path: 'household/current-marriage/information',
  depends: formData =>
    showMultiplePageResponse() && requiresSpouseInfo(formData),
  uiSchema: {
    ...titleUI('Marriage Information'),
    marriageType: radioUI({
      title: 'How did you get married?',
      labels: marriageTypeLabels,
      classNames: 'vads-u-margin-bottom--2',
    }),
    otherExplanation: {
      ...textUI({
        title: 'Tell us how you got married',
        hint:
          'You can enter common law, proxy (someone else represented you or your spouse at your marriage ceremony), tribal ceremony, or another way.',
      }),
      'ui:options': {
        expandUnder: 'marriageType',
        expandUnderCondition: 'OTHER',
      },
      'ui:required': otherExplanationRequired,
    },
    dateOfMarriage: {
      ...currentOrPastDateUI({
        title: 'Date of marriage',
        dataDogHidden: true,
      }),
    },
    locationOfMarriage: textUI({
      title: 'Place of marriage',
      hint: 'City and state or foreign country',
    }),
  },
  schema: {
    type: 'object',
    required: ['marriageType', 'dateOfMarriage', 'locationOfMarriage'],
    properties: {
      marriageType: radioSchema(Object.keys(marriageTypeLabels)),
      otherExplanation: textSchema,
      dateOfMarriage: currentOrPastDateSchema,
      locationOfMarriage: textSchema,
    },
  },
};
