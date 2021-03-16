import { expect } from 'chai';

import { sortQuestionnairesByStatus } from '../../../utils';

import testData from './data/order.questionnaire.data.json';

describe('health care questionnaire -- utils -- questionnaire list -- ordering by date --', () => {
  it('sorts completed', () => {
    const { data } = testData;
    const result = sortQuestionnairesByStatus(data);
    expect(result.completed).to.exist;
    const { completed } = result;
    const first = new Date(
      completed[0].appointment.attributes.vdsAppointments[0].appointmentTime,
    );
    const last = new Date(
      completed[
        completed.length - 1
      ].appointment.attributes.vdsAppointments[0].appointmentTime,
    );
    expect(first.getTime() < last.getTime()).to.be.true;
  });
  it('sorts todo', () => {
    const { data } = testData;
    const result = sortQuestionnairesByStatus(data);
    expect(result.toDo).to.exist;
    const { toDo } = result;
    const first = new Date(
      toDo[0].appointment.attributes.vdsAppointments[0].appointmentTime,
    );
    const last = new Date(
      toDo[
        toDo.length - 1
      ].appointment.attributes.vdsAppointments[0].appointmentTime,
    );
    expect(first.getTime() < last.getTime()).to.be.true;
  });
});
