import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import { CONDITIONS_FIRST } from '../../constants';
import introPage from '../conditionByConditionPages/intro'; // Same content as conditionByCondition so using to ensure consistency
import sideOfBodyPage from '../conditionByConditionPages/sideOfBody'; // Same content as conditionByCondition so using to ensure consistency
import conditionPage from './condition';
import summaryPage from './summary'; // Same content as conditionByCondition so using to ensure consistency
import { arrayBuilderOptions, hasSideOfBody } from './utils';

const isActiveDemo = formData => formData.demo === 'CONDITIONS_FIRST';

const conditionsFirstPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    conditionsFirstIntro: pageBuilder.introPage({
      title: 'New conditions intro',
      path: `new-conditions-${CONDITIONS_FIRST}-intro`,
      depends: isActiveDemo,
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    conditionsFirstSummary: pageBuilder.summaryPage({
      title: 'Review your new conditions',
      path: `new-conditions-${CONDITIONS_FIRST}-summary`,
      depends: isActiveDemo,
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    conditionsFirstCondition: pageBuilder.itemPage({
      title: 'Claim a new condition',
      path: `new-conditions-${CONDITIONS_FIRST}/:index/condition`,
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

        return hasSideOfBody(formData, index)
          ? helpers.navForwardKeepUrlParams(props)
          : helpers.navForwardFinishedItem(props);
      },
    }),
    conditionsFirstSideOfBody: pageBuilder.itemPage({
      title: 'Side of body of new condition',
      path: `new-conditions-${CONDITIONS_FIRST}/:index/side-of-body`,
      depends: (formData, index) =>
        isActiveDemo(formData) && hasSideOfBody(formData, index),
      uiSchema: sideOfBodyPage.uiSchema,
      schema: sideOfBodyPage.schema,
    }),
  }),
);

export default conditionsFirstPages;
