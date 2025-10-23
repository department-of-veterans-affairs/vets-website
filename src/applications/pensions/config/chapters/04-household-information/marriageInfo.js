import { hasMarriageHistory } from './helpers';
import { marriages } from '../../definitions';
import MarriageCount from '../../../components/MarriageCount';
import MarriageCountReview from '../../../components/MarriageCountReview';

export default {
  title: 'Marriage history',
  path: 'household/marriage-info',
  depends: hasMarriageHistory,
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
