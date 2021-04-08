import { expect } from 'chai';

import { questionnaireResponseSelector as questionnaireResponse } from '../index';

describe('health care questionnaire -- utils -- get questionnaire response status --', () => {
  it('QR is undefined', () => {
    const result = questionnaireResponse.getStatus(undefined);
    expect(result).to.be.null;
  });
  it('QR is not an array', () => {
    const result = questionnaireResponse.getStatus({});
    expect(result).to.be.null;
  });
  it('QR is empty array', () => {
    const result = questionnaireResponse.getStatus([]);
    expect(result).to.be.null;
  });
  it('QR has one', () => {
    const result = questionnaireResponse.getStatus([
      { submittedOn: new Date(), status: 'my cool status' },
    ]);
    expect(result).to.eq('my cool status');
  });
  it('QR has many -- uses the newest', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const result = questionnaireResponse.getStatus([
      { submittedOn: today, status: 'should be this' },
      { submittedOn: yesterday, status: 'not this' },
    ]);
    expect(result).to.eq('should be this');
  });
});
