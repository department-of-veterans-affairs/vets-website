import YesNoField from '../web-component-fields/YesNoField';

/**
 * Web component v3 uiSchema for yes or no questions
 *
 * ```js
 * hasHealthInsurance: yesNoUI('Do you have health insurance coverage?')
 * hasHealthInsurance: yesNoUI({
 *   title: 'Do you have health insurance coverage?'
 *   labels: {
 *     Y: 'Yes, I have health insurance',
 *     N: 'No, I do not have health insurance',
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
 *   labels?: {Y?: string, N?: string},
 *   tile?: boolean,
 *   required?: UISchemaOptions['ui:required'],
 *   yesNoReverse?: boolean,
 *   hint?: string,
 *   errorMessages?: UISchemaOptions['ui:errorMessages'],
 *   labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 * }} options - a string to use as the title or an object with options
 * @returns {UISchemaOptions}
 */
export const yesNoUI = options => {
  const {
    title,
    tile,
    labels,
    description,
    yesNoReverse,
    errorMessages,
    required,
    ...uiOptions
  } = typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': title,
    'ui:description': description,
    'ui:widget': 'yesNo', // This is required for the review page to render the field properly
    'ui:webComponentField': YesNoField,
    'ui:errorMessages': errorMessages,
    'ui:required': required,
    'ui:options': {
      labels: {
        Y: labels?.Y || 'Yes',
        N: labels?.N || 'No',
      },
      tile,
      yesNoReverse,
      ...uiOptions,
    },
  };
};

/**
 * @returns `type: 'boolean'`
 */
export const yesNoSchema = {
  type: 'boolean',
};
