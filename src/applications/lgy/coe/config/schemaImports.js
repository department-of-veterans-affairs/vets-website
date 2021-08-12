import fullSchema from 'vets-json-schema/dist/26-1880-schema.json';

const {
  applicantInformation,
  applicantContactInformation,
  communicationPreferences,
  serviceStatus,
  serviceHistory,
  hasExistingLoan,
  loanIntent,
  loanHistory,
  documentScreener,
  documentUpload,
} = fullSchema.properties;

export {
  applicantInformation,
  applicantContactInformation,
  communicationPreferences,
  serviceStatus,
  serviceHistory,
  hasExistingLoan,
  loanIntent,
  loanHistory,
  documentScreener,
  documentUpload,
};
