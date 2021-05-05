import completed from '../../../../../shared/api/mock-data/fhir/upcoming.appointment.completed.primary.care.questionnaire.json';
import todo from '../../../../../shared/api/mock-data/fhir/upcoming.appointment.not.started.primary.care.questionnaire.json';

const createFakeListStore = () => {
  return {
    getState: () => ({
      questionnaireListData: {
        list: {
          questionnaires: {
            completed: [completed],
            toDo: [todo],
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
};

const createFakeListStoreEmptyList = () => {
  return {
    getState: () => ({
      questionnaireListData: {
        list: {
          questionnaires: {
            completed: [],
            toDo: [],
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
};

const createFakeListStoreForServiceDown = () => {
  return {
    getState: () => ({
      questionnaireListData: {
        list: {
          questionnaires: {
            completed: undefined,
            toDo: undefined,
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
};

export {
  createFakeListStore,
  createFakeListStoreForServiceDown,
  createFakeListStoreEmptyList,
};
