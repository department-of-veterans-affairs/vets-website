import AddressValidationRadio from '../../../components/FormFields/AddressValidationRadio';
import FormElementTitle from '../../../components/FormElementTitle';

const addressConfirmationPage = {
  uiSchema: {
    addressConfirmation: {
      'ui:title': FormElementTitle({
        title: 'Veteran Address Confirmation',
      }),
      'ui:widget': AddressValidationRadio,
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      addressConfirmation: {
        type: 'string',
      },
    },
  },
};

export default addressConfirmationPage;
