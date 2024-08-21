import FormElementTitle from '../../../components/FormElementTitle';
import MedicalFacilitySearch from '../../../components/MedicalFacilitySearch';
import PageFieldSummary from '../../../components/PageFieldSummary';

const searchVAMedicalCenterPage = {
  uiSchema: {
    'ui:title': FormElementTitle({
      title: 'Your VA health facility',
    }),
    'ui:objectViewField': PageFieldSummary,
    vaMedicalCenter: {
      'ui:title': 'Search by city, postal code, or use your current location.',
      'ui:widget': MedicalFacilitySearch,
      'ui:errorMessages': {
        required: 'Please search for your health facility',
      },
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
