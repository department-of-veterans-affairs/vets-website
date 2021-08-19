import { expect } from 'chai';

import { createAnswerArray } from '../../submit-questionnaire';

describe('health care questionnaire -- utils -- create an answer array', () => {
  it('empty array is created with a falsey answer', () => {
    const answer = createAnswerArray();
    expect(answer).to.be.an('array');
    expect(answer.length).to.equal(0);
  });
  it('array is created with an answer', () => {
    const answer = createAnswerArray('my answer');
    expect(answer).to.be.an('array');
    expect(answer.length).to.equal(1);
    expect(answer[0]).to.have.property('valueString');
  });
});
