import { expect } from 'chai';

import reducer from '../../../reducers';

import {
  questionnaireAppointmentLoaded,
  questionnaireAppointmentLoading,
} from '../../../actions';

import testData from '../../../../shared/api/mock-data/fhir/upcoming.appointment.not.started.primary.care.questionnaire.json';

describe('health care questionnaire -- questionnaire reducer --', () => {
  it('should set loading to true', () => {
    const action = questionnaireAppointmentLoading();
    const state = reducer.questionnaireData(undefined, action);

    expect(state.context.status.isLoading).to.be.true;
  });
  it('should set loading to false', () => {
    const action = questionnaireAppointmentLoaded();
    const state = reducer.questionnaireData(undefined, action);

    expect(state.context.status.isLoading).to.be.false;
  });
  it('should set populate appointment data', () => {
    const action = questionnaireAppointmentLoaded(testData);
    const state = reducer.questionnaireData(undefined, action);
    // appointment
    expect(state.context.appointment.id).to.be.equal(testData.appointment.id);
    // questionnaire
    expect(state.context.questionnaire[0].id).to.be.equal(
      testData.questionnaire[0].id,
    );
    // location
    expect(state.context.location.id).to.be.equal(testData.location.id);
    // organization
    expect(state.context.organization.id).to.be.equal(testData.organization.id);
  });
});
