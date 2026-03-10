import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { LandMarketableFormNeededDescription } from '../../../components/Descriptions';
import { isHomeAcreageMoreThanTwo } from '../../../helpers';

export default {
  title: 'Additional form needed',
  path: 'financial/land-marketable/additional-form-needed',
  initialData: {},
  depends: formData =>
    isHomeAcreageMoreThanTwo(formData) && formData.landMarketable,
  uiSchema: {
    ...titleUI('Additional form needed', LandMarketableFormNeededDescription),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
