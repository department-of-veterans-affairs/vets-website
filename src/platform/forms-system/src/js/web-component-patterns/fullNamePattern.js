import { cloneDeep } from 'lodash';

import { validateWhiteSpace } from 'platform/forms/validations';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaTextInputField from '../web-component-fields/VaTextInputField';
import VaSelectField from '../web-component-fields/VaSelectField';

export function validateEmpty(errors, pageData) {
  const { first, last } = pageData;
  validateWhiteSpace(errors.first, first);
  validateWhiteSpace(errors.last, last);
}

// Some back end services such as benefits intake api only accept
// a-z, A-Z, hyphen, and spaces, but this is a minimal set of
// symbols to validate, and we let our local backend handle the rest,
// for example what to do with a name like José Ramírez
export function validateNameSymbols(errors, value, uiSchema, schema, messages) {
  const invalidCharsPattern = /[~!@#$%^&*+=[\]{}()<>;:"`\\/_|]/g;
  const matches = value.match(invalidCharsPattern);

  if (matches) {
    const uniqueInvalidChars = [...new Set(matches)].join(', ');
    const staticText =
      messages?.symbols ||
      'You entered a character we can’t accept. Try removing';
    errors.addError(`${staticText} ${uniqueInvalidChars}`);
  }
}

/**
 * Web component v3 uiSchema for `first`, `middle`, and `last name`
 *
 * ```js
 * fullName: fullNameNoSuffixUI()
 * fullName: fullNameNoSuffixUI((title) => `Your ${title}`))
 * ```
 * @param {(title: string) => string} [formatTitle] optional function to format the title. Prefer to use plain labels and specify person type in title of the page.
 * @param {UIOptions} [uiOptions] optional 'ui:options' to apply to every field
 * @returns {UISchemaOptions} uiSchema
 */
const fullNameNoSuffixUI = (formatTitle, uiOptions = {}) => {
  return {
    'ui:validations': [validateEmpty],
    first: {
      'ui:title': formatTitle ? formatTitle('first name') : 'First name',
      'ui:autocomplete': 'given-name',
      'ui:webComponentField': VaTextInputField,
      'ui:validations': [validateNameSymbols],
      'ui:errorMessages': {
        required: 'Please enter a first name',
      },
      'ui:options': {
        uswds: true,
        ...uiOptions,
      },
    },
    middle: {
      'ui:title': formatTitle ? formatTitle('middle name') : 'Middle name',
      'ui:webComponentField': VaTextInputField,
      'ui:autocomplete': 'additional-name',
      'ui:validations': [validateNameSymbols],
      'ui:options': {
        uswds: true,
        ...uiOptions,
      },
    },
    last: {
      'ui:title': formatTitle ? formatTitle('last name') : 'Last name',
      'ui:autocomplete': 'family-name',
      'ui:webComponentField': VaTextInputField,
      'ui:validations': [validateNameSymbols],
      'ui:errorMessages': {
        required: 'Please enter a last name',
      },
      'ui:options': {
        uswds: true,
        ...uiOptions,
      },
    },
  };
};

/**
 * Web component uiSchema for `first`, `last name` [no middle name]
 *
 * ```js
 * fullName: fullNameNoSuffixUI()
 * fullName: fullNameNoSuffixUI((title) => `Your ${title}`))
 * ```
 * @param {(title: string) => string} [formatTitle] optional function to format the title. Prefer to use plain labels and specify person type in title of the page.
 * @param {UIOptions} [uiOptions] optional 'ui:options' to apply to every field
 * @returns {UISchemaOptions} uiSchema
 */
const firstNameLastNameNoSuffixUI = (formatTitle, uiOptions = {}) => {
  return {
    'ui:validations': [validateEmpty],
    first: {
      'ui:title': formatTitle ? formatTitle('first name') : 'First name',
      'ui:autocomplete': 'given-name',
      'ui:webComponentField': VaTextInputField,
      'ui:validations': [validateNameSymbols],
      'ui:errorMessages': {
        required: 'Please enter a first name',
      },
      'ui:options': {
        uswds: true,
        ...uiOptions,
      },
    },
    last: {
      'ui:title': formatTitle ? formatTitle('last name') : 'Last name',
      'ui:autocomplete': 'family-name',
      'ui:webComponentField': VaTextInputField,
      'ui:validations': [validateNameSymbols],
      'ui:errorMessages': {
        required: 'Please enter a last name',
      },
      'ui:options': {
        uswds: true,
        ...uiOptions,
      },
    },
  };
};

/**
 * Web component uiSchema for `first`, `middle`, `last name`, and `suffix`
 * ```js
 * fullName: fullNameUI()
 * fullName: fullNameUI((title) => `Your ${title}`))
 * ```
 * @param {(title: string) => string} [formatTitle] optional function to format the title. Prefer to use plain labels and specify person type in title of the page.
 * @param {UIOptions} [uiOptions] optional 'ui:options' to apply to every field
 * @returns {UISchemaOptions} uiSchema
 */
const fullNameUI = (formatTitle, uiOptions = {}) => {
  return {
    ...fullNameNoSuffixUI(formatTitle, uiOptions),
    suffix: {
      'ui:title': formatTitle ? formatTitle('suffix') : 'Suffix',
      'ui:autocomplete': 'honorific-suffix',
      'ui:webComponentField': VaSelectField,
      'ui:options': {
        widgetClassNames: 'form-select-medium',
        uswds: true,
        ...uiOptions,
      },
    },
  };
};

/**
 * Web component uiSchema for `first`, `last name`, and `suffix`
 * [no middle name]
 * ```js
 * fullName: fullNameUI()
 * fullName: fullNameUI((title) => `Your ${title}`))
 * ```
 * @param {(title: string) => string} [formatTitle] optional function to format the title. Prefer to use plain labels and specify person type in title of the page.
 * @param {UIOptions} [uiOptions] optional 'ui:options' to apply to every field
 * @returns {UISchemaOptions} uiSchema
 */
const firstNameLastNameUI = (formatTitle, uiOptions = {}) => {
  return {
    ...firstNameLastNameNoSuffixUI(formatTitle, uiOptions),
    suffix: {
      'ui:title': formatTitle ? formatTitle('suffix') : 'Suffix',
      'ui:autocomplete': 'honorific-suffix',
      'ui:webComponentField': VaSelectField,
      'ui:options': {
        widgetClassNames: 'form-select-medium',
        uswds: true,
        ...uiOptions,
      },
    },
  };
};

/**
 * Web component uiSchema for `first`, `middle`, `last name`, `suffix`, and `maiden name`
 * ```js
 * fullName: fullNameWithMaidenNameUI()
 * fullName: fullNameWithMaidenNameUI((title) => `Your ${title}`))
 * ```
 * @param {(title: string) => string} [formatTitle] optional function to format the title. Prefer to use plain labels and specify person type in title of the page.
 * @param {UIOptions} [uiOptions] optional 'ui:options' to apply to every field
 * @returns {UISchemaOptions} uiSchema
 */
const fullNameWithMaidenNameUI = (formatTitle, uiOptions) => {
  return {
    ...fullNameUI(formatTitle, uiOptions),
    maiden: {
      'ui:title': "Mother's maiden name",
      'ui:webComponentField': VaTextInputField,
      'ui:validations': [validateNameSymbols],
      'ui:options': {
        uswds: true,
        ...uiOptions,
      },
    },
  };
};

/**
 * @returns `commonDefinitions.fullName`
 */
const fullNameSchema = commonDefinitions.fullName;

/**
 * @returns `commonDefinitions.fullName` minus `middle`
 */
const firstNameLastNameDef = cloneDeep(commonDefinitions.fullName);
delete firstNameLastNameDef.properties.middle;
const firstNameLastNameSchema = firstNameLastNameDef;

/**
 * @returns `commonDefinitions.fullNameNoSuffix`
 */
const fullNameNoSuffixSchema = commonDefinitions.fullNameNoSuffix;

/**
 * @returns `commonDefinitions.fullNameNoSuffix` minus `middle`
 */
const firstNameLastNameNoSuffixDef = cloneDeep(
  commonDefinitions.fullNameNoSuffix,
);
delete firstNameLastNameNoSuffixDef.properties.middle;
const firstNameLastNameNoSuffixSchema = firstNameLastNameNoSuffixDef;

/**
 * @returns `commonDefinitions.fullName + maiden`
 */
const fullNameWithMaidenNameSchema = {
  ...commonDefinitions.fullName,
  maiden: {
    type: 'string',
    maxLength: 30,
  },
};

export {
  fullNameNoSuffixUI,
  firstNameLastNameNoSuffixUI,
  fullNameWithMaidenNameUI,
  fullNameUI,
  firstNameLastNameUI,
  fullNameSchema,
  firstNameLastNameSchema,
  fullNameNoSuffixSchema,
  firstNameLastNameNoSuffixSchema,
  fullNameWithMaidenNameSchema,
};
