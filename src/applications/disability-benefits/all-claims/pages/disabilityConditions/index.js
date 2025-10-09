import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import { ConditionsIntroDescription } from '../../content/conditions';
import {
  arrayOptions,
  hasRatedDisabilities,
  isEditFromContext,
} from './shared/utils';
import summaryPage from './shared/summary';
import { remainingSharedPages } from './shared';
import conditionPage from './condition';

const ratedIntroPage = {
  uiSchema: {
    ...titleUI(
      'Add your disabilities and conditions',
      ConditionsIntroDescription,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export const disabilityConditionsWorkflow = arrayBuilderPages(
  arrayOptions,
  (pageBuilder, helpers) => ({
    Intro: pageBuilder.introPage({
      title: 'Add your disabilities and conditions',
      path: 'conditions/orientation',
      initialData: {
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
      uiSchema: ratedIntroPage.uiSchema,
      schema: ratedIntroPage.schema,
    }),

    Summary: pageBuilder.summaryPage({
      title: 'Review your conditions',
      path: `conditions/summary`,
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),

    Condition: pageBuilder.itemPage({
      title: 'Type of condition',
      path: `conditions/:index/condition`,
      depends: (formData, index, ctx) => {
        const noEdit = !isEditFromContext(ctx);
        const picked =
          formData?.newDisabilities?.[index]?.ratedDisability != null;

        const canAddMore = hasRatedDisabilities(formData, undefined);

        return noEdit && (picked || canAddMore);
      },
      uiSchema: conditionPage.uiSchema,
      schema: conditionPage.schema,
    }),

    ...remainingSharedPages(pageBuilder, helpers),
  }),
);
