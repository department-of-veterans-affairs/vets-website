import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import { CONDITION_BY_CONDITION } from '../../constants';
import causePage from './cause';
import causeNewPage from './causeNew';
import causeSecondaryPage from './causeSecondary';
import causeVAPage from './causeVA';
import causeWorsenedPage from './causeWorsened';
import conditionPage from './condition';
import introPage from './intro';
import newConditionDatePage from './newConditionDate';
import ratedDisabilityDatePage from './ratedDisabilityDate';
import sideOfBodyPage from './sideOfBody';
import summaryPage from './summary';
import { arrayBuilderOptions, hasSideOfBody } from './utils';

const isActiveDemo = formData => formData.demo === 'CONDITION_BY_CONDITION';

const isNewCondition = (formData, index) =>
  formData?.[arrayBuilderOptions.arrayPath]?.[index]?.newCondition;

const hasCause = (formData, index, cause) =>
  formData?.[arrayBuilderOptions.arrayPath]?.[index]?.cause === cause;

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
      title: 'Select condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/condition`,
      depends: isActiveDemo,
      uiSchema: conditionPage.uiSchema,
      schema: conditionPage.schema,
      onNavForward: props => {
        const { formData, index } = props;
        const item = formData?.[arrayBuilderOptions.arrayPath]?.[index];

        if (item) item.sideOfBody = undefined;

        return helpers.navForwardKeepUrlParams(props);
      },
    }),
    conditionByConditionSideOfBody: pageBuilder.itemPage({
      title: 'Side of body of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/side-of-body`,
      depends: (formData, index) =>
        isActiveDemo(formData) &&
        isNewCondition(formData, index) &&
        hasSideOfBody(formData, index),
      uiSchema: sideOfBodyPage.uiSchema,
      schema: sideOfBodyPage.schema,
    }),
    conditionByConditionRatedDisabilityDate: pageBuilder.itemPage({
      title: 'Start date of rated disability worsening',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/rated-disability-date`,
      depends: (formData, index) =>
        isActiveDemo(formData) && !isNewCondition(formData, index),
      uiSchema: ratedDisabilityDatePage.uiSchema,
      schema: ratedDisabilityDatePage.schema,
    }),
    conditionByConditionNewConditionDate: pageBuilder.itemPage({
      title: 'Start date of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/new-condition-date`,
      depends: (formData, index) =>
        isActiveDemo(formData) && isNewCondition(formData, index),
      uiSchema: newConditionDatePage.uiSchema,
      schema: newConditionDatePage.schema,
    }),
    conditionByConditionCause: pageBuilder.itemPage({
      title: 'Cause of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/cause`,
      depends: (formData, index) =>
        isActiveDemo(formData) && isNewCondition(formData, index),
      uiSchema: causePage.uiSchema,
      schema: causePage.schema,
    }),
    conditionByConditionCauseNew: pageBuilder.itemPage({
      title: 'Cause of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/cause-new`,
      depends: (formData, index) =>
        isActiveDemo(formData) &&
        isNewCondition(formData, index) &&
        hasCause(formData, index, 'NEW'),
      uiSchema: causeNewPage.uiSchema,
      schema: causeNewPage.schema,
    }),
    conditionByConditionCauseSecondary: pageBuilder.itemPage({
      title: 'Cause of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/cause-secondary`,
      depends: (formData, index) =>
        isActiveDemo(formData) &&
        isNewCondition(formData, index) &&
        hasCause(formData, index, 'SECONDARY'),
      uiSchema: causeSecondaryPage.uiSchema,
      schema: causeSecondaryPage.schema,
    }),
    conditionByConditionCauseWorsened: pageBuilder.itemPage({
      title: 'Cause of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/cause-worsened`,
      depends: (formData, index) =>
        isActiveDemo(formData) &&
        isNewCondition(formData, index) &&
        hasCause(formData, index, 'WORSENED'),
      uiSchema: causeWorsenedPage.uiSchema,
      schema: causeWorsenedPage.schema,
    }),
    conditionByConditionCauseVA: pageBuilder.itemPage({
      title: 'Cause of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/cause-va`,
      depends: (formData, index) =>
        isActiveDemo(formData) &&
        isNewCondition(formData, index) &&
        hasCause(formData, index, 'VA'),
      uiSchema: causeVAPage.uiSchema,
      schema: causeVAPage.schema,
    }),
  }),
);

export default conditionByConditionPages;
