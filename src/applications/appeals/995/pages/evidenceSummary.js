import evidenceVaDetails from './evidenceVaDetails';
import evidencePrivateRecords from './evidencePrivateRecords';

export default {
  uiSchema: {
    ...evidenceVaDetails.uiSchema,
    ...evidencePrivateRecords.uiSchema,
  },
  schema: {
    ...evidenceVaDetails.schema,
    ...evidencePrivateRecords.schema,
  },
};
