import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import YourPersonalInformationAuthenticated from '../../../components/YourPersonalInformationAuthenticated';
import { CHAPTER_3 } from '../../../constants';

const youPersonalInformationPage = {
  uiSchema: {
    ...titleUI({
      title: CHAPTER_3.YOUR_PERSONAL_INFORMATION.TITLE,
      headerLevel: 3,
    }),
    'view:YourPersonalInformation': {
      'ui:title': ' ',
      'ui:field': formData => YourPersonalInformationAuthenticated(formData),
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      'view:YourPersonalInformation': { type: 'string' },
    },
  },
};

export default youPersonalInformationPage;
