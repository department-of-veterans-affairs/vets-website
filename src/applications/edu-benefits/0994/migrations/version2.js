import _ from 'lodash';

export default function version2(savedData) {
  const trainingProgramsChoice =
    savedData.formData['view:trainingProgramsChoice'];

  if (typeof trainingProgramsChoice !== 'undefined') {
    const newData = _.set(
      savedData.formData,
      'hasSelectedPrograms',
      trainingProgramsChoice,
    );
    delete newData['view:trainingProgramsChoice'];

    return {
      formData: newData,
      metadata: savedData.metadata,
    };
  }
  return savedData;
}
