import FormElementTitle from '../../../components/FormFields/FormElementTitle';

const submitterContactPage = {
  uiSchema: {
    'ui:description': FormElementTitle({
      title: "Submitter's Contact Information",
    }),
    submitterFirstName: {
      'ui:title': 'Your First Name',
    },
  },
  schema: {
    type: 'object',
    required: ['submitterFirstName'],
    properties: {
      submitterFirstName: {
        type: 'string',
      },
    },
  },
};

export default submitterContactPage;
