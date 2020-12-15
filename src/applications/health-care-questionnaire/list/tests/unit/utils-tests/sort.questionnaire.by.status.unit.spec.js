import { expect } from 'chai';

import { sortQuestionnairesByStatus } from '../../../utils';

import testData from './data/sort.questionnaire.data.json';

describe('health care questionnaire -- utils -- questionnaire list -- sorting by status --', () => {
  it('undefined data', () => {
    const data = undefined;
    const result = sortQuestionnairesByStatus(data);
    expect(result.completed).to.exist;
    expect(result.toDo).to.exist;
  });
  it('good data', () => {
    const { data } = testData;
    const result = sortQuestionnairesByStatus(data);
    expect(result.completed).to.exist;
    expect(result.completed.length).to.equal(3);
    expect(result.toDo).to.exist;
    expect(result.toDo.length).to.equal(4);
  });
  it('no data', () => {
    const data = [];
    const result = sortQuestionnairesByStatus(data);
    expect(result.completed).to.exist;
    expect(result.toDo).to.exist;
  });
});
