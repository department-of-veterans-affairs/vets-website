import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import { CONDITION_BY_CONDITION } from '../../constants';
import causePage from './cause';
import causeNewPage from './causeNew';
import causeSecondaryPage from './causeSecondary';
import causeVAPage from './causeVA';
import causeWorsenedPage from './causeWorsened';
import conditionPage from './condition';
import introPage from './intro';
import newConditionPage from './newCondition';
import newConditionDatePage from './newConditionDate';
import ratedDisabilityDatePage from './ratedDisabilityDate';
import sideOfBodyPage from './sideOfBody';
import summaryPage from './summary';
import {
  arrayBuilderOptions,
  hasCause,
  hasRemainingRatedDisabilities,
  hasSideOfBody,
  isActiveDemo,
  isNewCondition,
} from './utils';

const currentDemo = 'CONDITION_BY_CONDITION';

const conditionByConditionPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    conditionByConditionIntro: pageBuilder.introPage({
      title: 'Conditions intro',
      path: `conditions-${CONDITION_BY_CONDITION}-intro`,
      depends: formData => isActiveDemo(formData, currentDemo),
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    conditionByConditionSummary: pageBuilder.summaryPage({
      title: 'Review your conditions',
      path: `condition-${CONDITION_BY_CONDITION}-summary`,
      depends: formData => isActiveDemo(formData, currentDemo),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    conditionByConditionCondition: pageBuilder.itemPage({
      title: 'Select rated disability or new condition',
      path: `conditions-${CONDITION_BY_CONDITION}/:index/condition`,
      depends: formData =>
        isActiveDemo(formData, currentDemo) &&
        hasRemainingRatedDisabilities(formData),
      uiSchema: conditionPage.uiSchema,
      schema: conditionPage.schema,
    }),
    conditionByConditionRatedDisabilityDate: pageBuilder.itemPage({
      title: 'Start date of rated disability worsening',
      path: `conditions-${CONDITION_BY_CONDITION}/:index/rated-disability-date`,
      depends: (formData, index) =>
        isActiveDemo(formData, currentDemo) &&
        hasRemainingRatedDisabilities(formData) &&
        !isNewCondition(formData, index),
      uiSchema: ratedDisabilityDatePage.uiSchema,
      schema: ratedDisabilityDatePage.schema,
    }),
    conditionByConditionNewCondition: pageBuilder.itemPage({
      title: 'Add a new condition',
      path: `conditions-${CONDITION_BY_CONDITION}/:index/new-condition`,
      depends: (formData, index) =>
        isActiveDemo(formData, currentDemo) && isNewCondition(formData, index),
      uiSchema: newConditionPage.uiSchema,
      schema: newConditionPage.schema,
      onNavForward: props => {
        const { formData, index } = props;
        const item = formData?.[arrayBuilderOptions.arrayPath]?.[index];

        if (item) item.sideOfBody = undefined;

        return helpers.navForwardKeepUrlParams(props);
      },
    }),
    conditionByConditionSideOfBody: pageBuilder.itemPage({
      title: 'Side of body of new condition',
      path: `conditions-${CONDITION_BY_CONDITION}/:index/side-of-body`,
      depends: (formData, index) =>
        isActiveDemo(formData, currentDemo) &&
        isNewCondition(formData, index) &&
        hasSideOfBody(formData, index),
      uiSchema: sideOfBodyPage.uiSchema,
      schema: sideOfBodyPage.schema,
    }),
    conditionByConditionNewConditionDate: pageBuilder.itemPage({
      title: 'Start date of new condition',
      path: `conditions-${CONDITION_BY_CONDITION}/:index/new-condition-date`,
      depends: (formData, index) =>
        isActiveDemo(formData, currentDemo) && isNewCondition(formData, index),
      uiSchema: newConditionDatePage.uiSchema,
      schema: newConditionDatePage.schema,
    }),
    conditionByConditionCause: pageBuilder.itemPage({
      title: 'Cause of new condition',
      path: `conditions-${CONDITION_BY_CONDITION}/:index/cause`,
      depends: (formData, index) =>
        isActiveDemo(formData, currentDemo) && isNewCondition(formData, index),
      uiSchema: causePage.uiSchema,
      schema: causePage.schema,
    }),
    conditionByConditionCauseNew: pageBuilder.itemPage({
      title: 'Follow-up of cause new',
      path: `conditions-${CONDITION_BY_CONDITION}/:index/cause-new`,
      depends: (formData, index) =>
        isActiveDemo(formData, currentDemo) &&
        isNewCondition(formData, index) &&
        hasCause(formData, index, 'NEW'),
      uiSchema: causeNewPage.uiSchema,
      schema: causeNewPage.schema,
    }),
    conditionByConditionCauseSecondary: pageBuilder.itemPage({
      title: 'Follow-up of cause secondary condition',
      path: `conditions-${CONDITION_BY_CONDITION}/:index/cause-secondary`,
      depends: (formData, index) =>
        isActiveDemo(formData, currentDemo) &&
        isNewCondition(formData, index) &&
        hasCause(formData, index, 'SECONDARY'),
      uiSchema: causeSecondaryPage.uiSchema,
      schema: causeSecondaryPage.schema,
    }),
    conditionByConditionCauseWorsened: pageBuilder.itemPage({
      title: 'Follow-up of cause worsened because of my service',
      path: `conditions-${CONDITION_BY_CONDITION}/:index/cause-worsened`,
      depends: (formData, index) =>
        isActiveDemo(formData, currentDemo) &&
        isNewCondition(formData, index) &&
        hasCause(formData, index, 'WORSENED'),
      uiSchema: causeWorsenedPage.uiSchema,
      schema: causeWorsenedPage.schema,
    }),
    conditionByConditionCauseVA: pageBuilder.itemPage({
      title: 'Follow-up of cause VA care',
      path: `conditions-${CONDITION_BY_CONDITION}/:index/cause-va`,
      depends: (formData, index) =>
        isActiveDemo(formData, currentDemo) &&
        isNewCondition(formData, index) &&
        hasCause(formData, index, 'VA'),
      uiSchema: causeVAPage.uiSchema,
      schema: causeVAPage.schema,
    }),
  }),
);

export default conditionByConditionPages;
