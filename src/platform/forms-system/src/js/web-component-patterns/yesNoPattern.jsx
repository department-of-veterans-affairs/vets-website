import YesNoField from '../web-component-fields/YesNoField';

/**
 * Web component uiSchema for yes or no questions
 *
 * ```js
 * hasHealthInsurance: yesNoUI('Do you have health insurance coverage?')
 * hasHealthInsurance: yesNoUI({
 *    title: 'Do you have health insurance coverage?'
 *    labels: {
 *      Y: 'Yes, I have health insurance',
 *      N: 'No, I do not have health insurance',
 *    },
 * })
 * ```
 *
 * if `yesNoReverse` is set to true, selecting `yes` will result in `false` instead of `true`
 *
 * @param {string | {
 *  title?: UISchemaOptions['ui:title'],
 *  description?: UISchemaOptions['ui:description'],
 *  labels?: {Y?: string, N?: string},
 *  tile?: boolean,
 *  yesNoReverse?: boolean,
 * }} options - a string to use as the title or an object with options
 * @returns {UISchemaOptions}
 */
export const yesNoUI = options => {
  const config = typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': config.title,
    'ui:description': config.description,
    'ui:widget': 'yesNo', // This is required for the review page to render the field properly
    'ui:webComponentField': YesNoField,
    'ui:options': {
      labels: {
        Y: config.labels?.Y || 'Yes',
        N: config.labels?.N || 'No',
      },
      tile: config.tile,
      yesNoReverse: config.yesNoReverse,
    },
  };
};

/**
 * @returns `type: 'boolean'`
 */
export const yesNoSchema = {
  type: 'boolean',
};
