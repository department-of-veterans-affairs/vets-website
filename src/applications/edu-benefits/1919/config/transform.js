import { cloneDeep, isNil } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transform(formConfig, form) {
  // Remove statement of truth field
  const statementAndAuthTransform = formData => {
    const clonedData = cloneDeep(formData);
    delete clonedData.statementOfTruthCertified;

    if (isNil(clonedData.isAuthenticated)) {
      clonedData.isAuthenticated =
        JSON.parse(localStorage.getItem('hasSession')) ?? false;
    }

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

  const allProprietaryProfitConflictsTransform = formData => {
    const clonedData = cloneDeep(formData);

    if (clonedData.allProprietaryProfitConflicts.length > 0) {
      clonedData.allProprietaryProfitConflicts.map(conflict => {
        // eslint-disable-next-line no-param-reassign
        conflict.enrollmentPeriod = {
          from: conflict?.enrollmentPeriodStart,
          to: conflict?.enrollmentPeriodEnd,
        };
        // eslint-disable-next-line no-param-reassign
        delete conflict.enrollmentPeriodStart;
        // eslint-disable-next-line no-param-reassign
        delete conflict.enrollmentPeriodEnd;

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
    statementAndAuthTransform,
    certifyingOfficialTransform,
    institutionTransform,
    conflictsTranform,
    dateTransform,
    proprietaryProfitConflictsTransform,
    allProprietaryProfitConflictsTransform,
    viewTransform, // this must appear last
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
