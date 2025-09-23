import {
  titleUI,
  textSchema,
  checkboxUI,
  checkboxRequiredSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import CapitalizingTextInputField from '../components/CapitalizingTextInput';

const uiSchema = {
  ...titleUI(
    'Initial each statement to acknowledge the Yellow Ribbon Program terms',
  ),
  'view:statement1': {
    'ui:description':
      'The Institution of Higher Learning (IHL) agrees that this Yellow Ribbon Program agreement is open-ended and will continue until terminated by either party. The IHL agrees to provide contributions to eligible individuals during the enrollment periods of March 15 through May 15 for U.S. schools and June 1 through July 31 for foreign schools, or the Monday following these dates if they fall on a weekend. The IHL agrees that any modifications to this agreement will be posted on www.gibill.va.gov.',
  },
  statement1Initial: {
    'ui:title': 'Initial here',
    'ui:autocomplete': 'off',
    'ui:webComponentField': CapitalizingTextInputField,
    'ui:options': {
      width: 'small',
      classNames: 'vads-u-margin-bottom--6',
    },
    'ui:errorMessages': {
      required: 'Please enter your initials',
    },
  },
  'view:statement2': {
    'ui:description':
      'The IHL agrees to provide contributions to eligible individuals on a first-come-first-serve basis. The IHL agrees that contributions may be provided from any source not already allocated for non-Yellow Ribbon purposes. The IHL agrees that student ledgers will denote contributions as "Yellow Ribbon," not as grants or scholarships.',
  },
  statement2Initial: {
    'ui:title': 'Initial here',
    'ui:autocomplete': 'off',
    'ui:webComponentField': CapitalizingTextInputField,
    'ui:options': {
      width: 'small',
      classNames: 'vads-u-margin-bottom--6',
    },
    'ui:errorMessages': {
      required: 'Please enter your initials',
    },
  },
  'view:statement3': {
    'ui:description':
      'The IHL agrees to provide contributions for participating individuals during the current academic year and subsequent academic years, provided the individual maintains satisfactory progress, conduct, and attendance. The IHL agrees that if an agreement modification reduces the contribution, the IHL will maintain the prior amount for individuals in good standing who previously received Yellow Ribbon benefits.',
  },
  statement3Initial: {
    'ui:title': 'Initial here',
    'ui:autocomplete': 'off',
    'ui:webComponentField': CapitalizingTextInputField,
    'ui:options': {
      width: 'small',
      classNames: 'vads-u-margin-bottom--6',
    },
    'ui:errorMessages': {
      required: 'Please enter your initials',
    },
  },
  'view:statement4': {
    'ui:description':
      'The IHL agrees that the maximum amount of contributions payable toward the net cost for each participating individual per term, quarter, or semester will not exceed the maximum dollar amount payable during the academic year.',
  },
  statement4Initial: {
    'ui:title': 'Initial here',
    'ui:autocomplete': 'off',
    'ui:webComponentField': CapitalizingTextInputField,
    'ui:options': {
      width: 'small',
      classNames: 'vads-u-margin-bottom--6',
    },
    'ui:errorMessages': {
      required: 'Please enter your initials',
    },
  },
  agreementCheckbox: checkboxUI({
    title: 'Our school agrees to provide Yellow Ribbon Program contributions',
    errorMessages: {
      required:
        'Please check the box to agree to provide Yellow Ribbon Program contributions',
    },
  }),
};

const schema = {
  type: 'object',
  required: [
    'statement1Initial',
    'statement2Initial',
    'statement3Initial',
    'statement4Initial',
    'agreementCheckbox',
  ],
  properties: {
    'view:statement1': { type: 'object', properties: {} },
    statement1Initial: {
      ...textSchema,
      maxLength: 3,
      pattern: '^[A-Za-z]{1,3}$',
    },
    'view:statement2': { type: 'object', properties: {} },
    statement2Initial: {
      ...textSchema,
      maxLength: 3,
      pattern: '^[A-Za-z]{1,3}$',
    },
    'view:statement3': { type: 'object', properties: {} },
    statement3Initial: {
      ...textSchema,
      maxLength: 3,
      pattern: '^[A-Za-z]{1,3}$',
    },
    'view:statement4': { type: 'object', properties: {} },
    statement4Initial: {
      ...textSchema,
      maxLength: 3,
      pattern: '^[A-Za-z]{1,3}$',
    },
    agreementCheckbox: checkboxRequiredSchema,
  },
};

export { uiSchema, schema };
