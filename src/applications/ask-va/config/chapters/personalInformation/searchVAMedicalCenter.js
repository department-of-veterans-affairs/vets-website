import FormElementTitle from '../../../components/FormElementTitle';

const searchVAMedicalCenterPage = {
  uiSchema: {
    'ui:description': FormElementTitle({
      title: 'Select your VA Medical Center',
    }),
    vaMedicalCenter: {
      'ui:title': 'Search by name',
    },
  },
  schema: {
    type: 'object',
    required: ['vaMedicalCenter'],
    properties: {
      vaMedicalCenter: {
        type: 'string',
      },
    },
  },
};

export default searchVAMedicalCenterPage;
