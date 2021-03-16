import { expect } from 'chai';

import { QuestionnaireResponseData } from '../factory';

describe('health care questionnaire -- utils -- test data -- data factory -- questionnaire response -- ', () => {
  it('questionnaire response is created with status', () => {
    const appointment = new QuestionnaireResponseData().withStatus('testing');

    expect(appointment).to.have.property('status');
    expect(appointment.status).to.equal('testing');
  });
});
