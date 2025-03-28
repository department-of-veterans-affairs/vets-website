import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import { RATED_OR_NEW_NEXT_PAGE as demo } from '../../constants';
import { introAndSummaryPages, remainingSharedPages } from '../shared';
import {
  arrayBuilderOptions,
  hasRatedDisabilitiesOrIsRatedDisability,
  isActiveDemo,
} from '../shared/utils';
import conditionPage, {
  NEW_CONDITION_OPTIONS,
  // updateFormData,
} from './condition';

const ratedOrNewNextPagePages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    ...introAndSummaryPages(demo, pageBuilder),
    [`${demo.name}Condition`]: pageBuilder.itemPage({
      title: 'Select rated disability or new condition',
      path: `conditions-${demo.label}/:index/condition`,
      depends: (formData, index) =>
        isActiveDemo(formData, demo.name) &&
        hasRatedDisabilitiesOrIsRatedDisability(formData, index),
      uiSchema: conditionPage.uiSchema,
      schema: conditionPage.schema,
      // updateFormData,
      onNavForward: props => {
        const { formData, index } = props;
        const { arrayPath } = arrayBuilderOptions;
        const item = formData?.[arrayPath]?.[index];
        const isNewConditionOption = Object.values(
          NEW_CONDITION_OPTIONS,
        ).includes(item?.ratedDisability);

        item.ratedDisability = isNewConditionOption
          ? undefined
          : item.ratedDisability;

        item['view:conditionType'] = isNewConditionOption ? 'NEW' : 'RATED';

        return helpers.navForwardKeepUrlParams(props);
      },
    }),
    ...remainingSharedPages(demo, pageBuilder, helpers),
  }),
);

export default ratedOrNewNextPagePages;
