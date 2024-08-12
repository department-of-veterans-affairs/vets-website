import { merge } from 'lodash';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { SecondayCaregiverTwoIntro } from '../../../components/FormDescriptions/SecondayCaregiverIntros';
import CustomYesNoReviewField from '../../../components/FormReview/CustomYesNoReviewField';
import content from '../../../locales/en/content.json';

const hasSecondaryCaregiverTwo = {
  uiSchema: {
    ...titleUI(content['secondary-two-intro-title'], SecondayCaregiverTwoIntro),
    'view:hasSecondaryCaregiverTwo': merge(
      {},
      yesNoUI({
        title: content['secondary-two-apply-label'],
      }),
      { 'ui:reviewField': CustomYesNoReviewField },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasSecondaryCaregiverTwo': yesNoSchema,
    },
  },
};

export default hasSecondaryCaregiverTwo;
