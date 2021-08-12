import { expect } from 'chai';

import reducer from '../index';

import {
  questionnaireListLoaded,
  questionnaireListLoading,
  questionnaireListLoadedWithError,
} from '../../actions';

import { sortQuestionnairesByStatus } from '../../utils';

import { json } from '../../../shared/api/mock-data/fhir/full.example.data';

describe('health care-questionnaire -- questionnaire reducer --', () => {
  it('should set loading to true', () => {
    const action = questionnaireListLoading();
    const state = reducer.questionnaireListData(undefined, action);
    expect(state.list.status.isLoading).to.be.true;
    expect(state.list.status.apiReturnedError).to.be.false;
  });
  it('api error - should set loading to false', () => {
    const action = questionnaireListLoadedWithError();
    const state = reducer.questionnaireListData(undefined, action);

    expect(state.list.status.isLoading).to.be.false;
    expect(state.list.status.apiReturnedError).to.be.true;
  });
  it('should set loading to false', () => {
    const action = questionnaireListLoaded();
    const state = reducer.questionnaireListData(undefined, action);

    expect(state.list.status.isLoading).to.be.false;
    expect(state.list.status.apiReturnedError).to.be.false;
  });
  it('should set populate appointment data', () => {
    const sorted = sortQuestionnairesByStatus(json.data);
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
