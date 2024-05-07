import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { isHomeAcreageMoreThanTwo } from '../../../helpers';
import HomeAcreageValueInput from '../../../components/HomeAcreageValueInput';
import HomeAcreageValueReview from '../../../components/HomeAcreageValueReview';

const { homeAcreageValue } = fullSchemaPensions.properties;

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
      homeAcreageValue,
    },
  },
};
