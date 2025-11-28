import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { createArrayBuilderItemAddPath } from 'platform/forms-system/src/js/patterns/array-builder/helpers';

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
      uiSchema: ratedIntroPage.uiSchema,
      schema: ratedIntroPage.schema,
    }),

    Summary: pageBuilder.summaryPage({
      title: 'Review your conditions',
      path: `conditions/summary`,
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
      onNavForward: props => {
        const { formData } = props;
        const hasConditions = formData?.['view:hasConditions'];

        if (!hasConditions) {
          return helpers.navForwardSummary(props);
        }

        const { arrayPath } = arrayOptions;
        const items = formData?.[arrayPath] || [];
        const nextIndex = items.length;

        // If there are still rated disabilities left to claim for increase,
        // go to Type of condition; otherwise go straight to Add new condition.
        const hasUnaddedRated = hasRatedDisabilities(formData, nextIndex);

        const basePath = hasUnaddedRated
          ? 'conditions/:index/condition'
          : 'conditions/:index/new-condition';

        const path = createArrayBuilderItemAddPath({
          path: basePath,
          index: nextIndex,
          isReview: !!props.urlParams?.review,
          removedAllWarn: false,
        });

        return props.goPath(path);
      },
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
