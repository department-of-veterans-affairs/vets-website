import fullSchema from 'vets-json-schema/dist/26-1880-schema.json';

const { definitions, properties } = fullSchema;
const {
  contactInformation,
  documentUpload,
  hasExistingLoan,
  loanHistory,
  personalInformation,
  serviceHistory,
  serviceStatus,
} = properties;

export {
  contactInformation,
  definitions,
  documentUpload,
  hasExistingLoan,
  loanHistory,
  personalInformation,
  serviceHistory,
  serviceStatus,
};
