import { validateWhiteSpace } from 'platform/forms/validations';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaTextInputField from '../web-component-fields/VaTextInputField';
import VaSelectField from '../web-component-fields/VaSelectField';

function validateName(errors, pageData) {
  const { first, last } = pageData;
  validateWhiteSpace(errors.first, first);
  validateWhiteSpace(errors.last, last);
}

/**
 * Web component uiSchema for `first`, `middle`, and `last name`
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
    'ui:validations': [validateName],
    first: {
      'ui:title': formatTitle ? formatTitle('first name') : 'First name',
      'ui:autocomplete': 'given-name',
      'ui:webComponentField': VaTextInputField,
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
      'ui:options': {
        uswds: true,
        ...uiOptions,
      },
    },
    last: {
      'ui:title': formatTitle ? formatTitle('last name') : 'Last name',
      'ui:autocomplete': 'family-name',
      'ui:webComponentField': VaTextInputField,
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
 * @returns `commonDefinitions.fullNameNoSuffix`
 */
const fullNameNoSuffixSchema = commonDefinitions.fullNameNoSuffix;

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
  fullNameWithMaidenNameUI,
  fullNameUI,
  fullNameSchema,
  fullNameNoSuffixSchema,
  fullNameWithMaidenNameSchema,
};
