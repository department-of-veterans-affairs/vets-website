import vaDetails from './vaDetails';
import privateDetails from './privateDetails';

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
