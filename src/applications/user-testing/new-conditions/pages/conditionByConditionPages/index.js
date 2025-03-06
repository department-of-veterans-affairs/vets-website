import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import causePage from './cause';
import causeFollowUpPage from './causeFollowUp';
import conditionPage from './condition';
import datePage from './date';
import introPage from './intro';
import sideOfBodyPage from './sideOfBody';
import summaryPage from './summary';
import { arrayBuilderOptions, hasSideOfBody } from './utils';
import { CONDITION_BY_CONDITION } from '../../constants';

const isActiveDemo = formData => formData.demo === 'CONDITION_BY_CONDITION';

const conditionByConditionPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    conditionByConditionIntro: pageBuilder.introPage({
      title: 'New conditions intro',
      path: `new-conditions-${CONDITION_BY_CONDITION}-intro`,
      depends: isActiveDemo,
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    conditionByConditionSummary: pageBuilder.summaryPage({
      title: 'Review your new conditions',
      path: `new-conditions-${CONDITION_BY_CONDITION}-summary`,
      depends: isActiveDemo,
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    conditionByConditionCondition: pageBuilder.itemPage({
      title: 'Claim a new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/condition`,
      depends: isActiveDemo,
      uiSchema: conditionPage.uiSchema,
      schema: conditionPage.schema,
      onNavForward: props => {
        const { formData, index } = props;
        const item = formData?.[arrayBuilderOptions.arrayPath]?.[index];

        // TODO: [Depends should clear the data of the dependent pages when the condition is no longer true](https://github.com/department-of-veterans-affairs/vagov-claim-classification/issues/691)
        // This fixed bug where side of body was not being cleared when condition was edited which could result in 'Asthma, right'
        // However, with this fix, when user doesn't change condition, side of body is still cleared which could confuse users
        // The depends should potentially clear the data of the dependent pages when the condition is no longer true
        // TODO: use setFormData instead of mutating formData directly.
        if (item) {
          item.sideOfBody = undefined;
        }

        return helpers.navForwardKeepUrlParams(props);
      },
    }),
    conditionByConditionSideOfBody: pageBuilder.itemPage({
      title: 'Side of body of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/side-of-body`,
      depends: (formData, index) =>
        isActiveDemo(formData) && hasSideOfBody(formData, index),
      uiSchema: sideOfBodyPage.uiSchema,
      schema: sideOfBodyPage.schema,
    }),
    conditionByConditionDate: pageBuilder.itemPage({
      title: 'Date of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/date`,
      depends: isActiveDemo,
      uiSchema: datePage.uiSchema,
      schema: datePage.schema,
    }),
    conditionByConditionCause: pageBuilder.itemPage({
      title: 'Cause of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/cause`,
      depends: isActiveDemo,
      uiSchema: causePage.uiSchema,
      schema: causePage.schema,
    }),
    conditionByConditionCauseFollowUp: pageBuilder.itemPage({
      title: 'Cause follow up for new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/cause-follow-up`,
      depends: isActiveDemo,
      uiSchema: causeFollowUpPage.uiSchema,
      schema: causeFollowUpPage.schema,
    }),
  }),
);

export default conditionByConditionPages;
