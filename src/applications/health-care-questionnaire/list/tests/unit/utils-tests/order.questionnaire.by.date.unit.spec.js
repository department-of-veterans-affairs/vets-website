import { expect } from 'chai';

import { sortQuestionnairesByStatus } from '../../../utils';

import { json } from '../../../../shared/api/mock-data/fhir/full.example.data';

describe('health care questionnaire -- utils -- questionnaire list -- ordering by date --', () => {
  it('sorts completed', () => {
    const { data } = json;
    const result = sortQuestionnairesByStatus(data);
    expect(result.completed).to.exist;
    const { completed } = result;
    const first = new Date(completed[0].appointment.start);
    const last = new Date(completed[completed.length - 1].appointment.start);
    expect(first.getTime() < last.getTime()).to.be.true;
  });
  it('sorts todo', () => {
    const { data } = json;
    const result = sortQuestionnairesByStatus(data);
    expect(result.toDo).to.exist;
    const { toDo } = result;
    const first = new Date(toDo[0].appointment.start);
    const last = new Date(toDo[toDo.length - 1].appointment.start);
    expect(first.getTime() < last.getTime()).to.be.true;
  });
});
