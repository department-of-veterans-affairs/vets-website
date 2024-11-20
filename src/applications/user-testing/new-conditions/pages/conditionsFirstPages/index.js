import { stringifyUrlParams } from '@department-of-veterans-affairs/platform-forms-system/helpers';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';

import conditionPage from './condition';
import datePage from './date';
import introPage from './intro';
import sideOfBodyPage from './sideOfBody';
import summaryPage from './summary';
import { arrayBuilderOptions, hasSideOfBody } from './utils';
import { CONDITIONS_FIRST } from '../../constants';

const conditionsFirstPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    conditionsFirstIntro: pageBuilder.introPage({
      title: 'New conditions intro',
      path: `new-conditions-${CONDITIONS_FIRST}-intro`,
      depends: formData => formData.demo === 'CONDITIONS_FIRST',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    conditionsFirstSummary: pageBuilder.summaryPage({
      title: 'Review your new conditions',
      path: `new-conditions-${CONDITIONS_FIRST}-summary`,
      depends: formData => formData.demo === 'CONDITIONS_FIRST',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    conditionsFirstCondition: pageBuilder.itemPage({
      title: 'Claim a new condition',
      path: `new-conditions-${CONDITIONS_FIRST}/:index/condition`,
      depends: formData => formData.demo === 'CONDITIONS_FIRST',
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
              `new-conditions-${CONDITIONS_FIRST}/${index}/date${urlParamsString}`,
            );
      },
    }),
    conditionsFirstSideOfBody: pageBuilder.itemPage({
      title: 'Side of body of new condition',
      path: `new-conditions-${CONDITIONS_FIRST}/:index/side-of-body`,
      depends: formData => formData.demo === 'CONDITIONS_FIRST',
      uiSchema: sideOfBodyPage.uiSchema,
      schema: sideOfBodyPage.schema,
    }),
    newConditionsJustConditionsDate: pageBuilder.itemPage({
      title: 'Date of new condition',
      path: `new-conditions-${CONDITIONS_FIRST}/:index/date`,
      depends: formData => formData.demo === 'CONDITIONS_FIRST',
      uiSchema: datePage.uiSchema,
      schema: datePage.schema,
      onNavBack: props => {
        const { formData, pathname, urlParams, goPath } = props;
        const index = getArrayIndexFromPathName(pathname);
        const urlParamsString = stringifyUrlParams(urlParams) || '';

        return hasSideOfBody(formData, index)
          ? helpers.navBackKeepUrlParams(props)
          : goPath(
              `new-conditions-${CONDITIONS_FIRST}/${index}/condition${urlParamsString}`,
            );
      },
    }),
  }),
);

export default conditionsFirstPages;
