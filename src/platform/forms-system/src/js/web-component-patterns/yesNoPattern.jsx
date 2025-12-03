import YesNoField from '../web-component-fields/YesNoField';

/**
 * uiSchema for yes or no questions. yesNoUI is an abstraction of radioUI tailored for binary yes/no questions.
 *
 * ```js
 * hasHealthInsurance: yesNoUI('Do you have health insurance coverage?')
 * hasHealthInsurance: yesNoUI({
 *   title: 'Do you have health insurance coverage?'
 *   labels: {
 *     Y: 'Yes, I have health insurance',
 *     N: 'No, I do not have health insurance',
 *   },
 *   descriptions: {
 *     Y: 'Select this if you currently have any form of health insurance coverage',
 *     N: 'Select this if you do not have health insurance coverage',
 *   },
 *   required: () => true,
 *   errorMessages: {
 *     required: 'Make a selection',
 *   },
 * })
 * ```
 *
 * if `yesNoReverse` is set to true, selecting `yes` will result in `false` instead of `true`
 *
 * @param {UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   description?: UISchemaOptions['ui:description'],
 *   descriptions?: { Y?: string, N?: string },
 *   labels?: { Y?: string, N?: string },
 *   tile?: boolean,
 *   required?: UISchemaOptions['ui:required'],
 *   yesNoReverse?: boolean,
 *   hint?: string,
 *   errorMessages?: UISchemaOptions['ui:errorMessages'],
 *   labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 *   confirmationField?: UISchemaOptions['ui:confirmationField'],
 * }} options - a string to use as the title or an object with options
 * @returns {UISchemaOptions}
 */
export const yesNoUI = options => {
  const {
    title,
    tile,
    labels,
    descriptions,
    description,
    yesNoReverse,
    errorMessages,
    required,
    confirmationField,
    ...uiOptions
  } = typeof options === 'object' ? options : { title: options };

  const uiOptionsObj = {
    labels: {
      Y: labels?.Y || 'Yes',
      N: labels?.N || 'No',
    },
    tile,
    yesNoReverse,
    ...uiOptions,
  };

  if (descriptions) {
    uiOptionsObj.descriptions = {
      Y: descriptions.Y,
      N: descriptions.N,
    };
  }

  return {
    'ui:title': title,
    'ui:description': description,
    'ui:widget': 'yesNo', // This is required for the review page to render the field properly
    'ui:webComponentField': YesNoField,
    'ui:errorMessages': errorMessages,
    'ui:required': required,
    'ui:options': uiOptionsObj,
    'ui:confirmationField': confirmationField,
  };
};

/**
 * @returns `type: 'boolean'`
 */
export const yesNoSchema = {
  type: 'boolean',
};
