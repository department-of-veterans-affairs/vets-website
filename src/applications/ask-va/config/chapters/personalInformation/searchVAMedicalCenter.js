import FormElementTitle from '../../../components/FormElementTitle';
import PageFieldSummary from '../../../components/PageFieldSummary';

const searchVAMedicalCenterPage = {
  uiSchema: {
    'ui:description': FormElementTitle({
      title: 'Select your VA Medical Center',
    }),
    'ui:objectViewField': PageFieldSummary,
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
