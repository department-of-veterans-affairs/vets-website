import EducationFacilitySearch from '../../../components/EducationFacilitySearch';
import PageFieldSummary from '../../../components/PageFieldSummary';
import FormElementTitle from '../../../components/FormElementTitle';

const searchSchoolsPage = {
  uiSchema: {
    'ui:title': FormElementTitle({
      title: 'School Information',
    }),
    'ui:objectViewField': PageFieldSummary,
    school: {
      'ui:title': 'Search by city, postal code, or use your current location.',
      'ui:widget': EducationFacilitySearch,
    },
  },
  schema: {
    type: 'object',
    required: ['school'],
    properties: {
      school: {
        type: 'string',
      },
    },
  },
};

export default searchSchoolsPage;
