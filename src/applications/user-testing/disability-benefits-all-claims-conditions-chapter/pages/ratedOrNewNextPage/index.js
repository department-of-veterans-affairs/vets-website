import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import { RATED_OR_NEW_NEXT_PAGE as demo } from '../../constants';
import { ConditionsIntroDescription } from '../../content/conditions';
import { introAndSummaryPages, remainingSharedPages } from '../shared';
import {
  arrayBuilderOptions,
  hasRatedDisabilities,
  isActiveDemo,
  isEditFromContext,
} from '../shared/utils';
import conditionPage from './condition';

const ratedOrNewNextPagePages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => {
    // Build default intro + summary which takes advantage of existing infrastructure
    const introAndSummary = introAndSummaryPages(demo, pageBuilder);

    // Enhancing the intro page here instead of using the intro in the shared directory
    const introKey = `${demo.name}Intro`;
    introAndSummary[introKey] = {
      ...introAndSummary[introKey],
      title: 'Add your disabilities and conditions',
      initialData: {
        demo: demo.name,
        ratedDisabilities: [
          {
            name: 'Tinnitus',
            ratedDisabilityId: '111111',
            ratingDecisionId: '0',
            diagnosticCode: 6260,
            decisionCode: 'SVCCONNCTED',
            decisionText: 'Service Connected',
            ratingPercentage: 10,
            maximumRatingPercentage: 100,
            disabilityActionType: 'NONE',
            'view:selected': true,
          },
          {
            name: 'Sciatica',
            ratedDisabilityId: '222222',
            ratingDecisionId: '0',
            diagnosticCode: 8998,
            decisionCode: 'SVCCONNCTED',
            decisionText: 'Service Connected',
            ratingPercentage: 20,
            maximumRatingPercentage: 100,
            disabilityActionType: 'NONE',
            'view:selected': true,
          },
          {
            name: 'Hypertension',
            ratedDisabilityId: '333333',
            ratingDecisionId: '0',
            diagnosticCode: 7101,
            decisionCode: 'SVCCONNCTED',
            decisionText: 'Service Connected',
            ratingPercentage: 10,
            maximumRatingPercentage: 100,
            disabilityActionType: 'NONE',
          },
        ],
      },
      uiSchema: {
        ...titleUI(
          'Add your disabilities and conditions',
          ConditionsIntroDescription,
        ),
      },
    };
    // Have the UI reflect the enhancement and tap into existing workflow
    return {
      ...introAndSummary,

      [`${demo.name}Condition`]: pageBuilder.itemPage({
        title: 'Type of condition',
        path: `conditions-${demo.label}/:index/condition`,
        depends: (formData, _i, ctx) =>
          isActiveDemo(formData, demo.name) &&
          !isEditFromContext(ctx) &&
          hasRatedDisabilities(formData),
        uiSchema: conditionPage.uiSchema,
        schema: conditionPage.schema,
      }),

      ...remainingSharedPages(demo, pageBuilder, helpers),
    };
  },
);

export default ratedOrNewNextPagePages;
