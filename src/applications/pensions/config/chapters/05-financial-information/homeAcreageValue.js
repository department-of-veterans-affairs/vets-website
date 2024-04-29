import { isHomeAcreageMoreThanTwo } from '../../../helpers';
import HomeAcreageValueInput from '../../../components/HomeAcreageValueInput';
import HomeAcreageValueReview from '../../../components/HomeAcreageValueReview';

export default {
  title: 'Home acreage value',
  path: 'financial/home-ownership/acres/value',
  depends: isHomeAcreageMoreThanTwo,
  CustomPage: HomeAcreageValueInput,
  CustomPageReview: HomeAcreageValueReview,
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      homeAcreageValue: {
        type: 'number',
      },
    },
  },
};
