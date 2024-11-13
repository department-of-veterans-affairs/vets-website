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

const newConditionsPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    newConditionsIntro: pageBuilder.introPage({
      title: 'New conditions intro',
      path: 'new-conditions-intro',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    newConditionsSummary: pageBuilder.summaryPage({
      title: 'Review your new conditions',
      path: 'new-conditions-summary',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    newConditionsCondition: pageBuilder.itemPage({
      title: 'Claim a new condition',
      path: 'new-conditions/:index/condition',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
      uiSchema: conditionPage.uiSchema,
      schema: conditionPage.schema,
      onNavForward: props => {
        const { formData, pathname, urlParams, goPath } = props;
        const index = getArrayIndexFromPathName(pathname);
        const urlParamsString = stringifyUrlParams(urlParams) || '';

        return hasSideOfBody(formData, index)
          ? helpers.navForwardKeepUrlParams(props)
          : goPath(`new-conditions/${index}/date${urlParamsString}`);
      },
    }),
    newConditionsSideOfBody: pageBuilder.itemPage({
      title: 'Side of body of new condition',
      path: 'new-conditions/:index/side-of-body',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
      uiSchema: sideOfBodyPage.uiSchema,
      schema: sideOfBodyPage.schema,
    }),
    newConditionsDate: pageBuilder.itemPage({
      title: 'Date of new condition',
      path: 'new-conditions/:index/date',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
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
    newConditionsCause: pageBuilder.itemPage({
      title: 'Cause of new condition',
      path: 'new-conditions/:index/cause',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
      uiSchema: causePage.uiSchema,
      schema: causePage.schema,
    }),
    newConditionsCauseFollowUp: pageBuilder.itemPage({
      title: 'Cause follow up for new condition',
      path: 'new-conditions/:index/cause-follow-up',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
      uiSchema: causeFollowUpPage.uiSchema,
      schema: causeFollowUpPage.schema,
    }),
  }),
);

export default newConditionsPages;
