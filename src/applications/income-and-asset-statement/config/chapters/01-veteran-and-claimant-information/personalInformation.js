import CustomPersonalInfo from '../../../components/CustomPersonalInfo';
import CustomPersonalInfoReview from '../../../components/CustomPersonalInfoReview';

/** @type {PageSchema} */
export default {
  title: 'Personal information',
  path: 'personal/information',
  depends: formData => formData?.claimantType === 'VETERAN',
  CustomPage: CustomPersonalInfo,
  CustomPageReview: CustomPersonalInfoReview,
  hideOnReview: false,
  schema: {
    type: 'object',
    properties: {}, // Must be present even if empty
  },
  uiSchema: {},
};
