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
};
