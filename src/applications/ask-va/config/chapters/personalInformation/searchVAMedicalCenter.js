import FormElementTitle from '../../../components/FormElementTitle';
import MedicalFacilitySearch from '../../../components/MedicalFacilitySearch';
import PageFieldSummary from '../../../components/PageFieldSummary';

const searchVAMedicalCenterPage = {
  uiSchema: {
    'ui:title': FormElementTitle({
      title: 'Your VA health facility',
    }),
    'ui:description':
      'Search by city, postal code, or use your current location.',
    'ui:objectViewField': PageFieldSummary,
    vaMedicalCenter: {
      'ui:title': ' ',
      'ui:widget': MedicalFacilitySearch,
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      vaMedicalCenter: {
        type: 'string',
      },
    },
  },
};

export default searchVAMedicalCenterPage;
