import fullSchema from 'vets-json-schema/dist/26-1880-schema.json';

const {
  personalInformation,
  contactInformation,
  serviceStatus,
  serviceHistory,
  hasExistingLoan,
  loanIntent,
  loanHistory,
  documentUpload,
} = fullSchema.properties;

export {
  personalInformation,
  contactInformation,
  serviceStatus,
  serviceHistory,
  hasExistingLoan,
  loanIntent,
  loanHistory,
  documentUpload,
};
