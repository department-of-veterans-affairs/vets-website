import { expect } from 'chai';

import reducer from '../../../reducers';

import {
  questionnaireAppointmentLoaded,
  questionnaireAppointmentLoading,
} from '../../../actions';

import testData from '../../../api/appointment-data.json';

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
    const action = questionnaireAppointmentLoaded(testData.data);
    const state = reducer.questionnaireData(undefined, action);
    expect(state.context.appointment.id).to.be.equal(testData.data.id);
    expect(
      state.context.appointment.attributes.vdsAppointments.length,
    ).to.be.equal(1);
    expect(state.context.appointment.attributes.vdsAppointments[0]).to.be.exist;
  });
});
