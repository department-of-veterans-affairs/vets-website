import CustomPersonalInfo from '../../../components/CustomPersonalInfo';
import CustomPersonalInfoReview from '../../../components/CustomPersonalInfoReview';
import { hasSession } from '../../../helpers';

/** @type {PageSchema} */
export default {
  title: 'Personal information',
  path: 'personal/information',
  depends: formData => formData?.claimantType === 'VETERAN' && hasSession(),
  CustomPage: CustomPersonalInfo,
  CustomPageReview: CustomPersonalInfoReview,
  hideOnReview: false,
  schema: {
    type: 'object',
    properties: {}, // Must be present even if empty
  },
  uiSchema: {},
};
