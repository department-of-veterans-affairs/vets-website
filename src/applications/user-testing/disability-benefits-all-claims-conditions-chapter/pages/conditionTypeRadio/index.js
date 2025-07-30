import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { CONDITION_TYPE_RADIO as demo } from '../../constants';

import { introAndSummaryPages, remainingSharedPages } from '../shared';
import {
  arrayBuilderOptions,
  hasRatedDisabilities,
  isActiveDemo,
  isEditFromContext,
  isRatedDisability,
} from '../shared/utils';
import ratedDisabilityPage from './ratedDisability';
import conditionTypePage from './conditionType';

const conditionTypeRadioPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    ...introAndSummaryPages(demo, pageBuilder),
    [`${demo.name}conditionType`]: pageBuilder.itemPage({
      title: 'Type of condition',
      path: `conditions-${demo.label}/:index/condition-type`,
      depends: (formData, index, context) =>
        isActiveDemo(formData, demo.name) &&
        !isEditFromContext(context) &&
        hasRatedDisabilities(formData, index),
      uiSchema: conditionTypePage.uiSchema,
      schema: conditionTypePage.schema,
    }),
    [`${demo.name}RatedDisability`]: pageBuilder.itemPage({
      title: 'Service-connected disabilities',
      path: `conditions-${demo.label}/:index/rated-disability`,
      depends: (formData, index, context) =>
        isActiveDemo(formData, demo.name) &&
        !isEditFromContext(context) &&
        hasRatedDisabilities(formData) &&
        isRatedDisability(formData, index),
      uiSchema: ratedDisabilityPage.uiSchema,
      schema: ratedDisabilityPage.schema,
    }),
    ...remainingSharedPages(demo, pageBuilder, helpers),
  }),
);

export default conditionTypeRadioPages;
