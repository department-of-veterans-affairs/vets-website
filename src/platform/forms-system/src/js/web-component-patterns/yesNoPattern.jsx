import YesNoField from '../web-component-fields/YesNoField';

/**
 * Web component uiSchema for yes or no questions
 *
 * ```js
 * hasHealthInsurance: yesNoUI('Do you have health insurance coverage?')
 * hasHealthInsurance: {
 *  ...yesNoUI('Do you have health insurance coverage?'),
 * }
 * ```
 * @param {string} title
 * @returns {UISchemaOptions}
 */
export const yesNoUI = title => {
  return {
    'ui:title': title,
    'ui:widget': 'yesNo', // This is required for the review page to render the field properly
    'ui:webComponentField': YesNoField,
    'ui:options': {
      labels: {
        yes: 'Yes',
        no: 'No',
      },
    },
  };
};

/**
 * @returns `type: 'boolean'`
 */
export const yesNoSchema = {
  type: 'boolean',
};
