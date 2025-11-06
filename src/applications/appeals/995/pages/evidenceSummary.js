import vaDetails from './evidence/vaDetails';
import privateDetails from './evidence/privateDetails';

export default {
  uiSchema: {
    ...vaDetails.uiSchema,
    ...privateDetails.uiSchema,
  },
  schema: {
    ...vaDetails.schema,
    ...privateDetails.schema,
  },
};
