const beforeStartDateErrorMsg = startDate => {
  const dateArray = startDate.split('-');
  // Show date string in MM/DD/YYYY format instead of YYYY-MM-DD
  const dateString = `${dateArray[1]}/${dateArray[2]}/${dateArray[0]}`;
  return `End date must be after the start date. Enter a date later than [${dateString}].`;
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
};
