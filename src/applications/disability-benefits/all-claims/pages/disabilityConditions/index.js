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
      onNavForward: props => {
        const { formData, setFormData, goPath, urlParams } = props;
        const { arrayPath } = arrayOptions;

        const items = formData?.[arrayPath] || [];
        const nextIndex = items.length;
        const hasUnaddedRated = hasRatedDisabilities(formData, undefined);

        // SPECIAL CASE: no rated disabilities AND no existing newDisabilities.
        // This is the "brand new claim, nothing rated" scenario.
        if (!hasUnaddedRated && nextIndex === 0) {
          const newItem = {
            condition: '', // will be filled on the NewCondition page
          };

          const updatedItems = [...items, newItem];

          setFormData({
            ...formData,
            [arrayPath]: updatedItems,
          });

          const path = createArrayBuilderItemAddPath({
            path: 'conditions/:index/new-condition',
            index: 0,
            isReview: !!urlParams?.review,
            removedAllWarn: false,
          });

          return goPath(path);
        }

        // In all other cases (there ARE rated disabilities, or items already exist),
        // just use the normal intro navigation behavior.
        return helpers.navForwardIntro
          ? helpers.navForwardIntro(props)
          : helpers.navForwardSummary(props);
      },
    }),

    Summary: pageBuilder.summaryPage({
      title: 'Review your conditions',
      path: `conditions/summary`,
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
      onNavForward: props => {
        const { formData, setFormData } = props;
        const hasConditions = formData?.['view:hasConditions'];

        if (!hasConditions) {
          return helpers.navForwardSummary(props);
        }

        const { arrayPath } = arrayOptions;
        const items = formData?.[arrayPath] || [];
        const nextIndex = items.length;
        const hasUnaddedRated = hasRatedDisabilities(formData, nextIndex);

        // If there are NO rated disabilities left, we're starting a brand new condition.
        // Pre-seed the array item so NewCondition has something to work with
        // and the progress bar won't show NaN.
        if (!hasUnaddedRated) {
          const newItem = {
            condition: '', // will be filled on the NewCondition page
          };

          const updatedItems = [...items, newItem];

          setFormData({
            ...formData,
            [arrayPath]: updatedItems,
          });
        }

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
      updateFormData: summaryPage.updateFormData,
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
      updateFormData: conditionPage.updateFormData,
    }),

    ...remainingSharedPages(pageBuilder, helpers),
  }),
);
