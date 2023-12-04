import sinon from 'sinon';
import { expect } from 'chai';
import analyticsFunctions from '../analytics-functions';

describe('analytics functions', () => {
  describe('applicantInformation', () => {
    it('records there are no required fields', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};

      analyticsFunctions.applicantInformation(formData);
      expect(push.calledOnce).to.be.false;
    });
    /*
                    it('does not record missing field when view exists', () => {
                      const push = sinon.stub(window.dataLayer, 'push');
                      const formData = {
                        'view:claimType': {
                          'view:claimingIncrease': true,
                          'view:claimingNew': true,
                        },
                      };

                      analyticsFunctions.claimType(formData);

                      expect(push.called).to.be.false;
                    });

             */
  });
  describe('benefitsEligibility', () => {
    it('records missing field', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};
      analyticsFunctions.benefitsEligibility(formData);
      expect(push.calledOnce).to.be.true;
    });
  });
  describe('militaryService', () => {
    it('records missing field', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};
      analyticsFunctions.militaryService(formData);
      expect(push.calledOnce).to.be.true;
    });
  });
  describe('highTechWorkExp', () => {
    it('records missing field', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};
      analyticsFunctions.highTechWorkExp(formData);
      expect(push.calledOnce).to.be.true;
    });
  });
  describe('contactInformation', () => {
    it('records there are no required fields', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};
      analyticsFunctions.contactInformation(formData);
      expect(push.calledOnce).to.be.false;
    });
  });
});
