import { expect } from 'chai';

import { QuestionnaireResponseData } from '../factory';

describe('health care questionnaire -- utils -- test data -- data factory -- questionnaire response -- ', () => {
  it('questionnaire response is created with status', () => {
    const qr = new QuestionnaireResponseData().withStatus('testing');

    expect(qr).to.have.property('status');
    expect(qr.status).to.equal('testing');
  });
});
