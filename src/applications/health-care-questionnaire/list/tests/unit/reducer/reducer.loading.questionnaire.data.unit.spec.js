import { expect } from 'chai';

import reducer from '../../../reducers';

import {
  questionnaireListLoaded,
  questionnaireListLoading,
} from '../../../actions';

import { sortQuestionnairesByStatus } from '../../../utils';

import testData from '../../../api/my-questionnaires.sample.json';

describe('health care-questionnaire -- questionnaire reducer --', () => {
  it('should set loading to true', () => {
    const action = questionnaireListLoading();
    const state = reducer.questionnaireListData(undefined, action);
    expect(state.list.status.isLoading).to.be.true;
  });
  it('should set loading to false', () => {
    const action = questionnaireListLoaded();
    const state = reducer.questionnaireListData(undefined, action);

    expect(state.list.status.isLoading).to.be.false;
  });
  it('should set populate appointment data', () => {
    const sorted = sortQuestionnairesByStatus(testData.data);
    const action = questionnaireListLoaded(sorted);

    const state = reducer.questionnaireListData(undefined, action);

    expect(state.list.questionnaires.completed.length).to.be.equal(
      action.data.completed.length,
    );
    expect(state.list.questionnaires.toDo.length).to.be.equal(
      action.data.toDo.length,
    );
  });
});
