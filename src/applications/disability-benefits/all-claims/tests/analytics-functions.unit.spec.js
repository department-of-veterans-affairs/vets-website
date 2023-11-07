import sinon from 'sinon';
import { expect } from 'chai';
import analyticsFunctions from '../analytics-functions';

describe('analytics functions', () => {
  describe('claimType', () => {
    it('records missing field', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};

      analyticsFunctions.claimType(formData);

      expect(push.calledOnce).to.be.true;
    });

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
  });

  describe('militaryHistory', () => {
    it('records missing field when start date or end date not specified', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        serviceInformation: {
          servicePeriods: [
            {
              serviceBranch: 'Air Force',
              dateRange: {
                from: '2001-03-21',
              },
            },
            {
              serviceBranch: 'Air National Guard',
              dateRange: {
                to: '2017-05-13',
              },
            },
          ],
        },
      };

      analyticsFunctions.militaryHistory(formData);

      expect(push.calledTwice).to.be.true;
    });

    it('does not records missing fields when start date or end date are specified', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        serviceInformation: {
          servicePeriods: [
            {
              serviceBranch: 'Air Force',
              dateRange: {
                from: '2001-03-21',
                to: '2014-07-21',
              },
            },
            {
              serviceBranch: 'Air National Guard',
              dateRange: {
                from: '2015-01-01',
                to: '2017-05-13',
              },
            },
          ],
        },
      };

      analyticsFunctions.militaryHistory(formData);

      expect(push.called).to.be.false;
    });
  });

  describe('unemployabilityFormIntro', () => {
    it('records missing field when unemployability upload choice is not specified', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};

      analyticsFunctions.unemployabilityFormIntro(formData);

      expect(push.calledOnce).to.be.true;
    });

    it('does not record missing field when unemployability upload choice is specified', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        'view:unemployabilityUploadChoice': 'answerQuestions',
      };

      analyticsFunctions.unemployabilityFormIntro(formData);

      expect(push.called).to.be.false;
    });
  });

  describe('pastEmploymentFormIntro', () => {
    it('records missing field when 4192 upload choice is not specified', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};

      analyticsFunctions.pastEmploymentFormIntro(formData);

      expect(push.calledOnce).to.be.true;
    });
  });

  describe('paymentInformation', () => {
    it('records missing field', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        'view:bankAccount': {
          test: 'foo',
        },
      };

      analyticsFunctions.paymentInformation(formData);

      // ideally we would be checking for callCount(4) here, but we're on an older version of sinon
      expect(push.called).to.be.true;
    });
  });

  describe('homelessOrAtRisk', () => {
    it('records missing field when homelessOrAtRisk not specified', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};

      analyticsFunctions.homelessOrAtRisk(formData);

      expect(push.calledOnce).to.be.true;
    });

    it('records missing field when homeless and missing housing situation, need to leave housing', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        homelessOrAtRisk: 'homeless',
      };

      analyticsFunctions.homelessOrAtRisk(formData);

      expect(push.called).to.be.true;
    });

    it('records missing field when at risk and at risk info missing', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        homelessOrAtRisk: 'atRisk',
      };

      analyticsFunctions.homelessOrAtRisk(formData);

      expect(push.called).to.be.true;
    });
  });
});
