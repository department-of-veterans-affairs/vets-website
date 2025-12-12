import CustomPersonalInfo from '../../../components/CustomPersonalInfo';
import CustomPersonalInfoReview from '../../../components/CustomPersonalInfoReview';

/** @type {PageSchema} */
export default {
  title: 'Your information',
  path: 'your-information',
  depends: formData => {
    return formData.coeFormRebuildCveteam;
  },
  CustomPage: CustomPersonalInfo,
  CustomPageReview: CustomPersonalInfoReview,
  hideOnReview: false,
  schema: {
    type: 'object',
    properties: {},
  },
  uiSchema: {},
};
