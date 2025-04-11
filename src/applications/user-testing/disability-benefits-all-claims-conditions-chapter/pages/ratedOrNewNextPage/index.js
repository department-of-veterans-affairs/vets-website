import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import { RATED_OR_NEW_NEXT_PAGE as demo } from '../../constants';
import { introAndSummaryPages, remainingSharedPages } from '../shared';
import {
  arrayBuilderOptions,
  hasRatedDisabilities,
  isActiveDemo,
} from '../shared/utils';
import conditionPage from './condition';

const ratedOrNewNextPagePages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    ...introAndSummaryPages(demo, pageBuilder),
    [`${demo.name}Condition`]: pageBuilder.itemPage({
      title: 'Select rated disability or new condition',
      path: `conditions-${demo.label}/:index/condition`,
      depends: (formData, _index, context) =>
        isActiveDemo(formData, demo.name) &&
        context.add &&
        hasRatedDisabilities(formData),
      uiSchema: conditionPage.uiSchema,
      schema: conditionPage.schema,
    }),
    ...remainingSharedPages(demo, pageBuilder, helpers),
  }),
);

export default ratedOrNewNextPagePages;
