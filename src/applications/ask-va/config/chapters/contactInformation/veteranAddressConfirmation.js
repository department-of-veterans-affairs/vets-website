import AddressValidationRadio from '../../../components/FormFields/AddressValidationRadio';
import FormElementTitle from '../../../components/FormElementTitle';

const veteranAddressConfirmationPage = {
  uiSchema: {
    addressConfirmation: {
      'ui:title': FormElementTitle({
        title: 'Veteran Address Confirmation',
      }),
      'ui:widget': AddressValidationRadio,
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

export default veteranAddressConfirmationPage;
