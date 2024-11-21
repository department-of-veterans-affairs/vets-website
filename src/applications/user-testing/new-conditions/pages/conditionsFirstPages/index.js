import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import conditionPage from './condition';
import introPage from './intro';
import sideOfBodyPage from './sideOfBody';
import summaryPage from './summary';
import { arrayBuilderOptions, hasSideOfBody } from './utils';
import { CONDITIONS_FIRST } from '../../constants';

const isActiveDemo = formData => formData.demo === 'CONDITIONS_FIRST';

const conditionsFirstPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
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
    }),
    conditionsFirstSideOfBody: pageBuilder.itemPage({
      title: 'Side of body of new condition',
      path: `new-conditions-${CONDITIONS_FIRST}/:index/side-of-body`,
      // TODO: Side of body is not being cleared when condition is edited which could result in 'Asthma, right'
      // If possible if user doesn't change condition while going through edit flow, side of body should not be cleared
      depends: (formData, index) =>
        isActiveDemo(formData) && hasSideOfBody(formData, index),
      uiSchema: sideOfBodyPage.uiSchema,
      schema: sideOfBodyPage.schema,
    }),
  }),
);

export default conditionsFirstPages;
