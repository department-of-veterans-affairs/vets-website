import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import FormElementTitle from '../../../components/FormElementTitle';
import YourSchool from '../../../components/FormFields/YourSchool';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3, schoolInYourProfileOptions } from '../../../constants';

const schoolInYourProfilePage = {
  uiSchema: {
    'ui:title': FormElementTitle({ title: CHAPTER_3.USE_THIS_SCHOOL.TITLE }),
    'ui:description': YourSchool,
    'ui:objectViewField': PageFieldSummary,
    useSchoolInProfile: radioUI({
      title: 'Do you want to use the school in your profile?',
      labels: schoolInYourProfileOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['useSchoolInProfile'],
    properties: {
      useSchoolInProfile: radioSchema(
        Object.values(schoolInYourProfileOptions),
      ),
    },
  },
};

export default schoolInYourProfilePage;
