import evidenceVaRecords from './evidenceVaRecords';
import evidencePrivateRecords from './evidencePrivateRecords';

export default {
  uiSchema: {
    ...evidenceVaRecords.uiSchema,
    ...evidencePrivateRecords.uiSchema,
  },
  schema: {
    ...evidenceVaRecords.schema,
    ...evidencePrivateRecords.schema,
  },
};
