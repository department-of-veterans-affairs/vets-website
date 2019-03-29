import _ from 'lodash';

export default function version2() {
  return savedData => {
    const trainingProgramsChoice =
      savedData.formData['view:trainingProgramsChoice'];

    if (typeof trainingProgramsChoice !== 'undefined') {
      const newData = _.set(
        savedData.formData,
        'hasSelectedPrograms',
        trainingProgramsChoice,
      );
      delete newData['view:trainingProgramsChoice'];

      return newData;
    }
    return savedData;
  };
}
