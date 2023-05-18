// import VaRadioField from '../web-component-fields/VaRadioField';
import YesNoField from '../web-component-fields/YesNoField';

/**
 * @param {string} title
 * @param {UIOptions} uiOptions - 'ui:options' object
 * @returns {UISchemaOptions}
 */
export const yesNoUI = (title, uiOptions) => {
  return {
    'ui:title': title,
    'ui:widget': 'yesNo', // This is required for the review page to render the field properly
    'ui:webComponentField': YesNoField,
    'ui:options': {
      labels: {
        yes: 'Yes',
        no: 'No',
      },
      ...uiOptions,
    },
  };
};

const schema = {
  type: 'boolean',
};

export const yesNoSchema = () => schema;
