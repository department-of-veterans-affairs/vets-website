import YesNoField from '../web-component-fields/YesNoField';

/**
 * @typedef {Object} YesNoUIOptions
 * @property {string} title
 * @property {UIDescription} [description]
 * @property {Object} [labels]
 * @property {string} [labels.Y='Yes']
 * @property {string} [labels.N='No']
 * @property {UITile} [tile]
 * @property {UIRequired} [required]
 * @property {boolean} [yesNoReverse]
 * @property {UIHint} [hint]
 * @property {UIErrorMessages} [errorMessages]
 * @property {UILabelHeaderLevel} [labelHeaderLevel]
 */

/**
 * @module YesNoPattern
 */

/**
 * Web component v3 uiSchema for yes or no questions
 *
 * @example
 * hasHealthInsurance: yesNoUI('Do you have health insurance coverage?')
 * hasHealthInsurance: yesNoUI({
 *   title: 'Do you have health insurance coverage?'
 *   labels: {
 *     Y: 'Yes, I have health insurance',
 *     N: 'No, I do not have health insurance',
 *   },
 *   descriptions: {
 *     Y: 'More details about Yes',
 *     N: 'More details about No',
 *   },
 *   required: () => true,
 *   errorMessages: {
 *     required: 'Make a selection',
 *   },
 *   description: 'This is a description',
 *   hint: 'This is a hint',
 *   labelHeaderLevel: '3',
 * })
 *
 * @example
 * // Use this if you need JSX description to be read by screen readers
 * hasHealthInsurance: yesNoUI({
 *   title: 'Do you have health insurance coverage?'
 *   useFormsPattern: 'single',
 *   formHeading: 'Form page title',
 *   formHeadingLevel: 3,
 *   formDescription: (<p>This is a description</p>)
 * })
 *
 * @example
 * // if `yesNoReverse` is set to true, selecting `yes` will result in `false` instead of `true`
 *
 * @param {UIOptions & YesNoUIOptions} options - a string to use as the title or an object with options
 * @returns {UISchemaOptions}
 * @function
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
