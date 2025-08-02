import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import { ConditionsIntroDescription } from '../../content/conditions';
import {
  arrayBuilderOptions,
  hasRatedDisabilities,
  isEditFromContext,
} from '../shared/utils';
import summaryPage from '../shared/summary';
import { remainingSharedPages } from '../shared';
import conditionPage from './condition';

//  Local intro page schema (was intro.js – now lives right here)
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

// Build every page explicitly w/o introAndSummaryPages
const ratedOrNewNextPagePages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    // ---------- Intro ----------
    Intro: pageBuilder.introPage({
      title: 'Add your disabilities and conditions',
      path: 'conditions-mango-intro',
      initialData: {
        demo: 'Mango Prototype',
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
      uiSchema: ratedIntroPage.uiSchema,
      schema: ratedIntroPage.schema,
    }),

    // ---------- Summary ----------
    Summary: pageBuilder.summaryPage({
      title: 'Review your conditions',
      path: `conditions-mango-summary`,
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),

    // ---------- Condition item page ----------
    Condition: pageBuilder.itemPage({
      title: 'Type of condition',
      path: `conditions-mango/:index/condition`,
      depends: (formData, _index, ctx) =>
        !isEditFromContext(ctx) && hasRatedDisabilities(formData),
      uiSchema: conditionPage.uiSchema,
      schema: conditionPage.schema,
    }),

    // ---------- Any other shared pages ----------
    ...remainingSharedPages(pageBuilder, helpers),
  }),
);

export default ratedOrNewNextPagePages;
