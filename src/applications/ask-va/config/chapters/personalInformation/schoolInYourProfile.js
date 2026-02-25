import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import YourSchool from '../../../components/FormFields/YourSchool';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3, schoolInYourProfileOptions } from '../../../constants';

const schoolInYourProfilePage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.USE_THIS_SCHOOL.TITLE),
    'ui:description': YourSchool,
    'ui:objectViewField': PageFieldSummary,
    useSchoolInProfile: radioUI({
      title: 'Select if you want to use the school in your profile',
      labelHeaderLevel: '4',
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
