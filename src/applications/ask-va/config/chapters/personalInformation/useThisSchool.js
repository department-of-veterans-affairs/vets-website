import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import FormElementTitle from '../../../components/FormElementTitle';
import SelectedSchool from '../../../components/FormFields/SelectedSchool';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3, useThisSchoolOptions } from '../../../constants';

const useThisSchoolPage = {
  uiSchema: {
    'ui:title': FormElementTitle({ title: CHAPTER_3.USE_THIS_SCHOOL.TITLE }),
    'ui:description': SelectedSchool,
    'ui:objectViewField': PageFieldSummary,
    useSchool: yesNoUI({
      title: CHAPTER_3.USE_THIS_SCHOOL.QUESTION_1,
      labelHeaderLevel: '4',
      labels: useThisSchoolOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['useSchool'],
    properties: {
      useSchool: yesNoSchema,
    },
  },
};

export default useThisSchoolPage;
