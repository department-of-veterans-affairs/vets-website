import fullSchema from 'vets-json-schema/dist/28-8832-schema.json';

const {
  claimantInformation,
  claimantStaticInformation,
  claimantAddress,
  claimantPhoneNumber,
  claimantEmailAddress,
  status,
  veteranInformation,
} = fullSchema.properties;

export {
  claimantInformation,
  claimantStaticInformation,
  claimantAddress,
  claimantPhoneNumber,
  claimantEmailAddress,
  status,
  veteranInformation,
};
