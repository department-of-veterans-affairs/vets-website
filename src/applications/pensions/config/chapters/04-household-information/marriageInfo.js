import { hasMarriageHistory } from './helpers';
import { marriages } from '../../definitions';
import MarriageCount from '../../../components/MarriageCount';
import MarriageCountReview from '../../../components/MarriageCountReview';
import { showMultiplePageResponse } from '../../../helpers';

export default {
  title: 'Marriage history',
  path: 'household/marriage-info',
  depends: formData =>
    !showMultiplePageResponse() && hasMarriageHistory(formData),
  CustomPage: MarriageCount,
  CustomPageReview: MarriageCountReview,
  uiSchema: {},
  schema: {
    type: 'object',
    required: ['marriages'],
    properties: {
      marriages,
    },
  },
};
