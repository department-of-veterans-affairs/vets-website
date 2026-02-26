import { options as dependentPagesOptions } from './chapters/04-household-information/dependentsPages';

const beforeStartDateErrorMsg = (startDate, customMessage) => {
  const dateArray = startDate.split('-');
  // Show date string in MM/DD/YYYY format instead of YYYY-MM-DD
  const dateString = `${dateArray[1]}/${dateArray[2]}/${dateArray[0]}`;
  const message = customMessage || 'End date must be after the start date.';
  return `${message} Enter a date later than ${dateString}.`;
};
const checkIfEndDateAfterStartDate = (endDate, startDate) => {
  const end = new Date(endDate);
  const start = new Date(startDate);
  return end.getTime() >= start.getTime();
};

export const validations = {
  isAfterMarriageStartDate: (errors, values, formData) => {
    if (
      formData?.marriageToVeteranStartDate &&
      !checkIfEndDateAfterStartDate(values, formData.marriageToVeteranStartDate)
    ) {
      errors.addError(
        beforeStartDateErrorMsg(formData.marriageToVeteranStartDate),
      );
    }
  },
  isAfterPreviousMarriageStartDate: (errors, values, formData) => {
    if (
      formData?.dateOfMarriage &&
      !checkIfEndDateAfterStartDate(values, formData.dateOfMarriage)
    ) {
      errors.addError(beforeStartDateErrorMsg(formData.dateOfMarriage));
    }
  },
  isAfterSeparationStartDate: (errors, values, formData) => {
    if (
      formData?.separationStartDate &&
      !checkIfEndDateAfterStartDate(values, formData.separationStartDate)
    ) {
      errors.addError(beforeStartDateErrorMsg(formData.separationStartDate));
    }
  },
  isAfterVeteranBirthDate: (errors, values, formData) => {
    if (
      formData?.veteranDateOfBirth &&
      !checkIfEndDateAfterStartDate(values, formData.veteranDateOfBirth)
    ) {
      errors.addError(
        beforeStartDateErrorMsg(
          formData.veteranDateOfBirth,
          'Date of death must be after the date of birth.',
        ),
      );
    }
  },
  isAfterTreatmentStartDate: (errors, values, formData) => {
    if (
      formData?.startDate &&
      !checkIfEndDateAfterStartDate(values, formData.startDate)
    ) {
      errors.addError(beforeStartDateErrorMsg(formData.startDate));
    }
  },
  doesDependentCountMatch: (errors, values, formData) => {
    const numberOfDependents = Number(values);
    const { maxItems } = dependentPagesOptions;
    const errorMessage =
      'Your dependent list doesn’t match your total count. Go back and change your total count, or remove the dependents that don’t belong on this list.';
    // If dependent count is equal to or less than veteran dependents max items,
    // they should match.
    if (
      numberOfDependents <= maxItems &&
      formData?.veteransChildren?.length &&
      numberOfDependents !== formData.veteransChildren.length
    ) {
      errors.addError(errorMessage);
    }
    // If dependent count is greater than veteran dependents max items,
    // there should be at least max item length of dependents added.
    if (
      numberOfDependents > maxItems &&
      formData?.veteransChildren?.length &&
      formData.veteransChildren.length !== maxItems
    ) {
      errors.addError(errorMessage);
    }
    // If no dependents added but count is more than 0
    if (
      (!numberOfDependents || numberOfDependents === 0) &&
      formData?.veteransChildren?.length > 0
    ) {
      errors.addError(errorMessage);
    }
  },
};
