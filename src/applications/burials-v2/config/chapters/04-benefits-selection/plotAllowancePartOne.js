import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import {
  yesNoUI,
  // currencyUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
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
    govtContributions: {
      ...yesNoUI({
        title:
          'Did the federal government, state government, or the Veteran’s employer pay any of the burial costs?',
        errorMessages: 'Select yes or no',
        classNames: 'vads-u-margin-bottom--2',
      }),
    },
    amountGovtContribution: {
      // ...currencyUI({
      //   title: 'Amount the government or employer paid',
      //   hideIf: form => !form?.govtContributions,
      // }),
      // 'ui:required': form => form?.govtContributions,
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
