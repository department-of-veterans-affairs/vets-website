import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import HealthInsuranceSummaryCard from '../../components/FormDescriptions/HealthInsuranceSummaryCard';
import content from '../../locales/en/content.json';
import { OHI_ITEM_MAX } from '../../utils/constants';
import { createModalTitleOrDescription } from '../../utils/helpers';
import { validateHealthInsurancePlan } from '../../utils/validations';

const yesNoOptions = {
  title: content['health-insurance--yes-no-title'],
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '4',
};

const yesNoOptionsMore = {
  title: content['health-insurance--yes-no-more-title'],
  hint: content['health-insurance--yes-no-hint'],
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '4',
};

export const ohiArrayOptions = {
  arrayPath: 'healthInsurance',
  nounSingular: 'plan',
  nounPlural: 'plans',
  required: false,
  isItemIncomplete: validateHealthInsurancePlan,
  maxItems: OHI_ITEM_MAX,
  text: {
    getItemName: item => item?.provider,
    cardDescription: HealthInsuranceSummaryCard,
    cancelAddTitle: content['health-insurance--cancel-add-title'],
    cancelAddDescription: content['health-insurance--cancel-add-description'],
    cancelAddNo: content['arraybuilder--button-cancel-no'],
    cancelAddYes: content['arraybuilder--button-cancel-yes'],
    cancelEditTitle: createModalTitleOrDescription(
      'health-insurance--cancel-edit-item-title',
      'health-insurance--cancel-edit-noun-title',
    ),
    cancelEditDescription: content['health-insurance--cancel-edit-description'],
    cancelEditNo: content['arraybuilder--button-delete-no'],
    cancelEditYes: content['arraybuilder--button-cancel-yes'],
    deleteDescription: createModalTitleOrDescription(
      'health-insurance--delete-item-description',
      'health-insurance--delete-noun-description',
    ),
    deleteNo: content['arraybuilder--button-delete-no'],
    deleteYes: content['arraybuilder--button-delete-yes'],
    summaryTitle: content['health-insurance--summary-title'],
    summaryTitleWithoutItems:
      content['health-insurance--summary-title-no-items'],
  },
};

export default {
  uiSchema: {
    'view:hasHealthInsurance': arrayBuilderYesNoUI(
      ohiArrayOptions,
      yesNoOptions,
      yesNoOptionsMore,
    ),
  },
  schema: {
    type: 'object',
    required: ['view:hasHealthInsurance'],
    properties: {
      'view:hasHealthInsurance': arrayBuilderYesNoSchema,
    },
  },
};
