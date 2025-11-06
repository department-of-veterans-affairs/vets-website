import vaDetails from './evidence/vaDetails';
import evidencePrivateRecords from './evidencePrivateRecords';

export default {
  uiSchema: {
    ...vaDetails.uiSchema,
    ...evidencePrivateRecords.uiSchema,
  },
  schema: {
    ...vaDetails.schema,
    ...evidencePrivateRecords.schema,
  },
};
