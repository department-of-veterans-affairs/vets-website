import { isMarried } from './helpers';
import { marriages } from '../../definitions';
import MarriageCount from '../../../components/MarriageCount';

export default {
  title: 'Marriage history',
  path: 'household/marriage-info',
  depends: isMarried,
  CustomPage: MarriageCount,
  CustomPageReview: null,
  uiSchema: {},
  schema: {
    type: 'object',
    required: ['marriages'],
    properties: {
      marriages,
    },
  },
};
