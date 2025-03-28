import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { RATED_OR_NEW_RADIOS as demo } from '../../constants';

import { introAndSummaryPages, remainingSharedPages } from '../shared';
import {
  arrayBuilderOptions,
  hasRemainingRatedDisabilities,
  isActiveDemo,
  isNewCondition,
} from '../shared/utils';
import ratedDisabilitiesPage from './ratedDisabilities';
import ratedOrNewPage from './ratedOrNew';

const ratedOrNewRadiosPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    ...introAndSummaryPages(demo, pageBuilder),
    [`${demo.name}RatedOrNew`]: pageBuilder.itemPage({
      title: 'Select rated disability or new condition',
      path: `conditions-${demo.label}/:index/rated-or-new`,
      depends: formData =>
        isActiveDemo(formData, demo.name) &&
        hasRemainingRatedDisabilities(formData),
      uiSchema: ratedOrNewPage.uiSchema,
      schema: ratedOrNewPage.schema,
    }),
    [`${demo.name}RatedDisabilities`]: pageBuilder.itemPage({
      title: 'Select which existing disability has worsened.',
      path: `conditions-${demo.label}/:index/rated-disabilities`,
      depends: (formData, index) =>
        isActiveDemo(formData, demo.name) &&
        !isNewCondition(formData, index) &&
        hasRemainingRatedDisabilities(formData),
      uiSchema: ratedDisabilitiesPage.uiSchema,
      schema: ratedDisabilitiesPage.schema,
    }),
    ...remainingSharedPages(demo, pageBuilder, helpers),
  }),
);

export default ratedOrNewRadiosPages;
