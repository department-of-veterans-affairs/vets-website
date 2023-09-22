import FormElementTitle from '../../../components/FormFields/FormElementTitle';

const veteransAddressPage = {
  uiSchema: {
    'ui:description': FormElementTitle({
      title: 'Veteran Contact Information',
    }),
    firstName: {
      'ui:title': 'First Name',
    },
  },
  schema: {
    type: 'object',
    required: ['firstName'],
    properties: {
      firstName: {
        type: 'string',
      },
    },
  },
};

export default veteransAddressPage;
