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
  pageBuilder => ({
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
    }),
    conditionByConditionSideOfBody: pageBuilder.itemPage({
      title: 'Side of body of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/side-of-body`,
      // TODO: Side of body is not being cleared when condition is edited which could result in 'Asthma, right'
      // If possible if user doesn't change condition while going through edit flow, side of body should not be cleared
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
