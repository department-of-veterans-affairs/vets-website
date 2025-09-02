import { cloneDeep } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transform(formConfig, form) {
  // Remove statement of truth field
  const statementTransform = formData => {
    const clonedData = cloneDeep(formData);

    delete clonedData.statementOfTruthCertified;

    return clonedData;
  };

  // Assign correct 'Certifying Official' level
  const certifyingOfficialTransform = formData => {
    const clonedData = cloneDeep(formData);

    if (clonedData.certifyingOfficial.role?.level === 'certifyingOfficial') {
      clonedData.certifyingOfficial.role.level = 'certifying official';
    }

    return clonedData;
  };

  const institutionTransform = formData => {
    const clonedData = cloneDeep(formData);

    // Handle facility code that has not been assigned
    if (!clonedData.institutionDetails.facilityCode) {
      clonedData.institutionDetails.facilityCode = '12345678';
    }
    // Remove loader flag
    delete clonedData.institutionDetails.loader;

    return clonedData;
  };

  // Populate list & loops arrays with empty object if optional questions are 'No'
  const conflictsTranform = formData => {
    const clonedData = cloneDeep(formData);

    if (!clonedData.proprietaryProfitConflicts) {
      clonedData.proprietaryProfitConflicts = [];
    }
    if (!clonedData.allProprietaryProfitConflicts) {
      clonedData.allProprietaryProfitConflicts = [];
    }

    return clonedData;
  };

  // Set *dateSigned* field to today's date
  const dateTransform = formData => {
    const clonedData = cloneDeep(formData);

    const date = new Date();
    const offset = date.getTimezoneOffset();
    const today = new Date(date.getTime() - offset * 60 * 1000);
    const [todaysDate] = today.toISOString().split('T');
    clonedData.dateSigned = todaysDate;

    return clonedData;
  };

  const proprietaryProfitConflictsTransform = formData => {
    const clonedData = cloneDeep(formData);

    if (clonedData.proprietaryProfitConflicts.length > 0) {
      clonedData.proprietaryProfitConflicts.map(conflict => {
        if (
          conflict?.affiliatedIndividuals?.individualAssociationType ===
          'vaEmployee'
        ) {
          // eslint-disable-next-line no-param-reassign
          conflict.affiliatedIndividuals.individualAssociationType = 'va';
        } else if (
          conflict?.affiliatedIndividuals?.individualAssociationType ===
          'saaEmployee'
        ) {
          // eslint-disable-next-line no-param-reassign
          conflict.affiliatedIndividuals.individualAssociationType = 'saa';
        }
        return conflict;
      });
    }

    return clonedData;
  };

  // Removes view fields and stringifies the form data
  const viewTransform = formData =>
    transformForSubmit(
      formConfig,
      { ...form, data: formData },
      (_key, value) => value, // return all values (including empty object arrays)
    );

  const transformedData = [
    statementTransform,
    certifyingOfficialTransform,
    institutionTransform,
    conflictsTranform,
    dateTransform,
    proprietaryProfitConflictsTransform,
    viewTransform, // this must appear last
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
