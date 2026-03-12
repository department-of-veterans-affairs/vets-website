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
      path: 'conditions/summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
      onNavForward: props => {
        const { formData, setFormData } = props;
        const { arrayPath } = arrayOptions;

        const items = formData?.[arrayPath] || [];
        const hasAnyItems = items.length > 0;

        const hasConditions = formData?.['view:hasConditions'];

        // GUARD: You can't leave this page with zero conditions.
        // If the user got here with an empty array (e.g., via "Finish this application later"),
        // force them into the add flow regardless of answering "No".
        if (!hasAnyItems) {
          const nextIndex = 0;

          // Determine whether we should start with rated pick page or new-condition page
          const hasUnaddedRated = hasRatedDisabilities(formData, nextIndex);

          // If no rated disabilities left to pick from, pre-seed so NewCondition can render safely
          if (!hasUnaddedRated) {
            const newItem = { condition: '' };
            setFormData({
              ...formData,
              [arrayPath]: [newItem],
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
        }

        // If they answered "No" AND we already have at least one condition,
        // allow them to move on.
        if (!hasConditions) {
          return helpers.navForwardSummary(props);
        }

        // If they answered "Yes", then go add another condition
        const nextIndex = items.length;
        const hasUnaddedRated = hasRatedDisabilities(formData, nextIndex);

        if (!hasUnaddedRated) {
          const newItem = { condition: '' };
          setFormData({
            ...formData,
            [arrayPath]: [...items, newItem],
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
