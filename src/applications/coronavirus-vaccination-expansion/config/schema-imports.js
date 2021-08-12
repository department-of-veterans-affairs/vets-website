import fullSchema from 'vets-json-schema/dist/COVID-VACCINATION-EXPANSION-schema.json';

const {
  attestation,
  notEligible,
  complianceAgreement,
  militaryHistory,
  veteranInformation,
  personalInformation,
  addressInformation,
  vaLocation,
} = fullSchema.properties;

export {
  attestation,
  notEligible,
  complianceAgreement,
  militaryHistory,
  veteranInformation,
  personalInformation,
  addressInformation,
  vaLocation,
};
