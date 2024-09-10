import EducationFacilitySearch from '../../../components/EducationFacilitySearch';
import PageFieldSummary from '../../../components/PageFieldSummary';
import FormElementTitle from '../../../components/FormElementTitle';

const searchSchoolsPage = {
  uiSchema: {
    'ui:objectViewField': PageFieldSummary,
    school: {
      'ui:title': FormElementTitle({
        title: 'School Information',
      }),
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
