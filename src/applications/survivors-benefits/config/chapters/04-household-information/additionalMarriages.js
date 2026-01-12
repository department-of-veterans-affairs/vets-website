import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isYes } from '../../../utils/helpers';
import { AdditionalMarriagesAlert } from '../../../components/FormAlerts';

/** @type {PageSchema} */
export default {
  title: 'Additional marriages',
  path: 'household/additional-marriages',
  uiSchema: {
    ...titleUI('Additional marriages'),
    claimantHasAdditionalMarriages: yesNoUI({
      title: 'Did you have more than 1 marriage after the Veteran’s death?',
    }),
    additionalMarriagesAlert: {
      'ui:description': AdditionalMarriagesAlert,
      'ui:options': {
        hideIf: formData => !isYes(formData?.claimantHasAdditionalMarriages),
        displayEmptyObjectOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['claimantHasAdditionalMarriages'],
    properties: {
      claimantHasAdditionalMarriages: yesNoSchema,
      additionalMarriagesAlert: {
        type: 'object',
        properties: {},
      },
    },
  },
};
