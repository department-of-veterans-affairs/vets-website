import EducationFacilitySearch from '../../../components/EducationFacilitySearch';
import PageFieldSummary from '../../../components/PageFieldSummary';
import FormElementTitle from '../../../components/FormElementTitle';

const searchSchoolsPage = {
  uiSchema: {
    'ui:objectViewField': PageFieldSummary,
    school: {
      'ui:title': FormElementTitle({
        title: 'School information',
      }),
      'ui:widget': EducationFacilitySearch,
      'ui:errorMessages': {
        required: 'Select your school facility',
      },
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
