import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { CONDITION_TYPE_RADIO as demo } from '../../constants';

import { introAndSummaryPages, remainingSharedPages } from '../shared';
import {
  arrayBuilderOptions,
  hasRatedDisabilitiesAndIsRatedDisability,
  hasRatedDisabilitiesOrIsRatedDisability,
  isActiveDemo,
} from '../shared/utils';
import ratedDisabilityPage from './ratedDisability';
import conditionTypePage from './conditionType';

const conditionTypeRadioPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    ...introAndSummaryPages(demo, pageBuilder),
    [`${demo.name}conditionType`]: pageBuilder.itemPage({
      title: 'Select condition type',
      path: `conditions-${demo.label}/:index/condition-type`,
      depends: (formData, index) =>
        isActiveDemo(formData, demo.name) &&
        hasRatedDisabilitiesOrIsRatedDisability(formData, index),
      uiSchema: conditionTypePage.uiSchema,
      schema: conditionTypePage.schema,
    }),
    [`${demo.name}RatedDisability`]: pageBuilder.itemPage({
      title: 'Select which existing disability has worsened.',
      path: `conditions-${demo.label}/:index/rated-disability`,
      depends: (formData, index) =>
        isActiveDemo(formData, demo.name) &&
        hasRatedDisabilitiesAndIsRatedDisability(formData, index),
      uiSchema: ratedDisabilityPage.uiSchema,
      schema: ratedDisabilityPage.schema,
    }),
    ...remainingSharedPages(demo, pageBuilder, helpers),
  }),
);

export default conditionTypeRadioPages;
