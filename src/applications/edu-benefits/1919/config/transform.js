import { cloneDeep } from 'lodash';

export default function transform(form) {
  const clonedData = cloneDeep(form.data);

  // Remove ui/view fields
  delete clonedData['view:allProprietaryProfitConflictsMissingInformation'];
  delete clonedData['view:introduction'];
  delete clonedData['view:proprietaryProfitConflictsMissingInformation'];
  delete clonedData.statementOfTruthCertified;

  // Assign correct 'Certifying Official' level
  if (clonedData.certifyingOfficial.role?.level === 'certifyingOfficial') {
    clonedData.certifyingOfficial.role.level = 'certifying official';
  }

  // Populate institution address
  const institutionAddress = cloneDeep(clonedData.institutionDetails.address);
  clonedData.institutionDetails.institutionAddress = institutionAddress;
  delete clonedData.institutionDetails.address;

  // Populate list & loops arrays with empty object if optional questions are 'No'
  if (!clonedData.isProfitConflictOfInterest) {
    clonedData.proprietaryProfitConflicts = [];
  }
  if (!clonedData.allProprietaryConflictOfInterest) {
    clonedData.allProprietaryProfitConflicts = [];
  }

  // Set *dateSigned* field to today's date
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const today = new Date(date.getTime() - offset * 60 * 1000);
  const [todaysDate] = today.toISOString().split('T');
  clonedData.dateSigned = todaysDate;

  return JSON.stringify({
    educationBenefitsClaim: {
      form: JSON.stringify(clonedData),
    },
  });
}
