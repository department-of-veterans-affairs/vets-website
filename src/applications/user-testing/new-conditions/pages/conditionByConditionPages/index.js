import { stringifyUrlParams } from '@department-of-veterans-affairs/platform-forms-system/helpers';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';

import causePage from './cause';
import causeFollowUpPage from './causeFollowUp';
import conditionPage from './condition';
import datePage from './date';
import introPage from './intro';
import sideOfBodyPage from './sideOfBody';
import summaryPage from './summary';
import { arrayBuilderOptions, hasSideOfBody } from './utils';
import { CONDITION_BY_CONDITION } from '../../constants';

const conditionByConditionPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    conditionByConditionIntro: pageBuilder.introPage({
      title: 'New conditions intro',
      path: `new-conditions-${CONDITION_BY_CONDITION}-intro`,
      depends: formData => formData.demo === 'CONDITION_BY_CONDITION',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    conditionByConditionSummary: pageBuilder.summaryPage({
      title: 'Review your new conditions',
      path: `new-conditions-${CONDITION_BY_CONDITION}-summary`,
      depends: formData => formData.demo === 'CONDITION_BY_CONDITION',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    conditionByConditionCondition: pageBuilder.itemPage({
      title: 'Claim a new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/condition`,
      depends: formData => formData.demo === 'CONDITION_BY_CONDITION',
      uiSchema: conditionPage.uiSchema,
      schema: conditionPage.schema,
      onNavForward: props => {
        const { formData, pathname, urlParams, goPath } = props;
        const index = getArrayIndexFromPathName(pathname);
        const urlParamsString = stringifyUrlParams(urlParams) || '';

        // TODO: This fixed bug where side of body was not being cleared when condition was edited which could result in 'Asthma, right'
        // However, with this fix, when user doesn't change condition, side of body is cleared which could confuse users
        formData.sideOfBody = undefined;

        return hasSideOfBody(formData, index)
          ? helpers.navForwardKeepUrlParams(props)
          : goPath(
              `new-conditions-${CONDITION_BY_CONDITION}/${index}/date${urlParamsString}`,
            );
      },
    }),
    conditionByConditionSideOfBody: pageBuilder.itemPage({
      title: 'Side of body of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/side-of-body`,
      depends: formData => formData.demo === 'CONDITION_BY_CONDITION',
      uiSchema: sideOfBodyPage.uiSchema,
      schema: sideOfBodyPage.schema,
    }),
    conditionByConditionDate: pageBuilder.itemPage({
      title: 'Date of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/date`,
      depends: formData => formData.demo === 'CONDITION_BY_CONDITION',
      uiSchema: datePage.uiSchema,
      schema: datePage.schema,
      onNavBack: props => {
        const { formData, pathname, urlParams, goPath } = props;
        const index = getArrayIndexFromPathName(pathname);
        const urlParamsString = stringifyUrlParams(urlParams) || '';

        return hasSideOfBody(formData, index)
          ? helpers.navBackKeepUrlParams(props)
          : goPath(`new-conditions/${index}/condition${urlParamsString}`);
      },
    }),
    conditionByConditionCause: pageBuilder.itemPage({
      title: 'Cause of new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/cause`,
      depends: formData => formData.demo === 'CONDITION_BY_CONDITION',
      uiSchema: causePage.uiSchema,
      schema: causePage.schema,
    }),
    conditionByConditionCauseFollowUp: pageBuilder.itemPage({
      title: 'Cause follow up for new condition',
      path: `new-conditions-${CONDITION_BY_CONDITION}/:index/cause-follow-up`,
      depends: formData => formData.demo === 'CONDITION_BY_CONDITION',
      uiSchema: causeFollowUpPage.uiSchema,
      schema: causeFollowUpPage.schema,
    }),
  }),
);

export default conditionByConditionPages;
