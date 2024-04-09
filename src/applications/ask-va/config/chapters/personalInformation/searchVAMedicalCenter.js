import MedicalFacilitySearch from '../../../components/MedicalFacilitySearch';
import PageFieldSummary from '../../../components/PageFieldSummary';

const searchVAMedicalCenterPage = {
  uiSchema: {
    'ui:objectViewField': PageFieldSummary,
    vaMedicalCenter: {
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
