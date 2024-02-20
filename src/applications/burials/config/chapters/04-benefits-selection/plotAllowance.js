import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import {
  yesNoUI,
  currencyUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
// import { VaTextInputField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
// import VaNumberInputField from '../../../../../platform/forms-system/src/js/web-component-fields/VaNumberInputField';
// import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { generateTitle } from '../../../utils/helpers';

const {
  // placeOfRemains,
  // federalCemetery,
  // stateCemetery,
  govtContributions,
  amountGovtContribution,
} = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Plot or interment allowance'),
    // placeOfRemains: {
    //   'ui:title': 'Place of burial or location of deceased Veteran’s remains',
    // },
    // federalCemetery: {
    //   'ui:title':
    //     'Was the Veteran buried in a national cemetery, or one owned by the federal government?',
    //   'ui:widget': 'yesNo',
    // },
    // stateCemetery: {
    //   'ui:title': 'Was the Veteran buried in a state Veterans cemetery?',
    //   'ui:widget': 'yesNo',
    //   'ui:required': form => form.federalCemetery === false,
    //   'ui:options': {
    //     expandUnder: 'federalCemetery',
    //     expandUnderCondition: false,
    //   },
    // },
    govtContributions: {
      //   'ui:title':
      //     'Did a federal/state government or the Veteran’s employer contribute to the burial?  (Not including employer life insurance)',
      //   'ui:widget': 'yesNo',
      ...yesNoUI({
        title:
          'Did the federal government, state government, or the Veteran’s employer pay any of the burial costs?',
        errorMessages: 'Select yes or no',
        classNames: 'vads-u-margin-bottom--2',
      }),
    },
    amountGovtContribution: {
      ...currencyUI({
        title: 'Amount the government or employer paid',
        hideIf: form => !form?.govtContributions,
      }),
      'ui:required': form => form?.govtContributions,
    },
  },
  schema: {
    type: 'object',
    properties: {
      //   placeOfRemains,
      //   federalCemetery,
      //   stateCemetery,
      govtContributions,
      amountGovtContribution,
    },
  },
};
