import {
  livingSituationChoices,
  livingSituationError,
} from '../content/livingSituation';

export const livingSituationNone = (errors, _fieldData, formData) => {
  // Show an error if "none" is selected with any other choices
  if (formData.livingSituation.none) {
    const hasOtherChoices = Object.keys(livingSituationChoices)
      .filter(key => key !== 'none')
      .some(key => formData.livingSituation[key]);
    if (hasOtherChoices) {
      errors.addError(livingSituationError);
    }
  }
};
