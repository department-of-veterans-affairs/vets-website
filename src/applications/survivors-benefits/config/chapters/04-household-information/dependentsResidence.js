import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { AdditionalDependentsAlert } from '../../../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Dependent’s residence'),
    childrenLiveTogetherButNotWithSpouse: yesNoUI({
      title:
        'Do the children who don’t live with you reside at the same address?',
    }),
    residenceAlert: {
      'ui:description': AdditionalDependentsAlert,
      'ui:options': {
        // Should hide if undefined when first landing on page or true/yes.
        hideIf: formData =>
          formData?.childrenLiveTogetherButNotWithSpouse !== false,
        displayEmptyObjectOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['childrenLiveTogetherButNotWithSpouse'],
    properties: {
      childrenLiveTogetherButNotWithSpouse: yesNoSchema,
      residenceAlert: {
        type: 'object',
        properties: {},
      },
    },
  },
};
