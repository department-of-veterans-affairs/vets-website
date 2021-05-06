import { expect } from 'chai';

import { questionnaireResponseSelector as questionnaireResponse } from '../index';

describe('health care questionnaire -- utils -- get questionnaire response status --', () => {
  describe('qr status', () => {
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

  describe('qr item', () => {
    it('QR is undefined', () => {
      const result = questionnaireResponse.getQuestionnaireResponse(undefined);
      expect(result).to.be.null;
    });
    it('QR is not an array', () => {
      const result = questionnaireResponse.getQuestionnaireResponse({});
      expect(result).to.be.null;
    });
    it('QR is empty array', () => {
      const result = questionnaireResponse.getQuestionnaireResponse([]);
      expect(result).to.be.null;
    });
    it('QR has one', () => {
      const result = questionnaireResponse.getQuestionnaireResponse([
        { submittedOn: new Date(), status: 'my cool status', id: 'some-id' },
      ]);
      expect(result).to.have.property('id');
      expect(result.id).to.eq('some-id');

      expect(result).to.have.property('status');
      expect(result.status).to.eq('my cool status');
    });
    it('QR has many -- uses the newest', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const result = questionnaireResponse.getQuestionnaireResponse([
        { submittedOn: today, status: 'should be this', id: 'this-id' },
        { submittedOn: yesterday, status: 'not this', id: 'not-this-id' },
      ]);
      expect(result).to.have.property('id');
      expect(result.id).to.eq('this-id');

      expect(result).to.have.property('status');
      expect(result.status).to.eq('should be this');
    });
  });
});
