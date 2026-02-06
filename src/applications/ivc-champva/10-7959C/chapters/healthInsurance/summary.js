import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateHealthInsurancePlan } from '../../utils/validation';
import { replaceStrValues } from '../../utils/helpers';
import { OHI_ITEM_MAX } from '../../utils/constants';
import HealthInsuranceSummaryCard from '../../components/FormDescriptions/HealthInsuranceSummaryCard';
import content from '../../locales/en/content.json';

const yesNoOptions = {
  title: content['health-insurance--yes-no-title'],
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '4',
};

const yesNoMoreOptions = {
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
    cancelEditTitle: props => {
      const itemName = props.getItemName(
        props.itemData,
        props.index,
        props.formData,
      );
      return itemName
        ? replaceStrValues(
            content['health-insurance--cancel-edit-item-title'],
            itemName,
          )
        : replaceStrValues(
            content['health-insurance--cancel-edit-noun-title'],
            props.nounSingular,
          );
    },
    cancelEditDescription: content['health-insurance--cancel-edit-description'],
    cancelEditNo: content['arraybuilder--button-delete-no'],
    cancelEditYes: content['arraybuilder--button-cancel-yes'],
    deleteDescription: props => {
      const itemName = props.getItemName(
        props.itemData,
        props.index,
        props.formData,
      );
      return itemName
        ? replaceStrValues(
            content['health-insurance--delete-item-description'],
            itemName,
          )
        : replaceStrValues(
            content['health-insurance--delete-noun-description'],
            props.nounSingular,
          );
    },
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
      yesNoMoreOptions,
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
