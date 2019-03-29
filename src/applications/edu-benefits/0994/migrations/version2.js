import _ from 'lodash';

export default function version2() {
  return savedData => {
    const trainingProgramsChoice = _.get(
      savedData.metadata,
      'view:trainingProgramsChoice',
    );

    if (trainingProgramsChoice) {
      const newData = _.set(
        savedData.metadata,
        'hasSelectedPrograms',
        trainingProgramsChoice,
      );
      return newData;
    }
    return savedData;
  };
}
