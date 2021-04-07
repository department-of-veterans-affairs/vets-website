import { expect } from 'chai';

import { createAnAnswer } from '../../submit-questionnaire';

describe('health care questionnaire -- utils -- create an answer item', () => {
  it('structure is created with empty data', () => {
    const answer = createAnAnswer();
    expect(answer.valueString).to.be.undefined;
    expect(answer).to.have.property('valueString');
  });
  it('structure is created with data', () => {
    const text = 'my answer';
    const answer = createAnAnswer(text);
    expect(answer).to.have.property('valueString');
    expect(answer.valueString).to.equal(text);
  });
});
