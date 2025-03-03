import sinon from 'sinon';
import { expect } from 'chai';
import analyticsFunctions from '../analytics-functions';
// import minimal from 'e2e/fixtures/data/minimal.json'

describe('analytics functions', () => {
  describe('applicantInformation', () => {
    it('records there are no required fields', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};

      analyticsFunctions.applicantInformation(formData);
      expect(push.calledOnce).to.be.false;
    });
    it('records there are is applicantFullName.first', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        applicantFullName: {
          first: 'TestFirstName',
        },
      };
      analyticsFunctions.applicantInformation(formData);
      expect(push.calledOnce).to.be.false;
    });
    it('records there are is applicantFullName.last', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        applicantFullName: {
          last: 'TestLastName',
        },
      };
      analyticsFunctions.applicantInformation(formData);
      expect(push.calledOnce).to.be.false;
    });
    it('records there are is applicantSocialSecurityNumber', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        applicantFullName: {
          last: 'TestLastName',
        },
        applicantSocialSecurityNumber: '796127519',
      };
      analyticsFunctions.applicantInformation(formData);
      expect(push.calledOnce).to.be.false;
    });
  });
  // dateOfBirth: '1944-11-26'
  it('records there are is dateOfBirth', () => {
    const push = sinon.stub(window.dataLayer, 'push');
    const formData = {
      dateOfBirth: '1944-11-26',
    };
    analyticsFunctions.applicantInformation(formData);
    expect(push.calledOnce).to.be.false;
  });
  describe('benefitsEligibility', () => {
    it('records missing field', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};
      analyticsFunctions.benefitsEligibility(formData);
      expect(push.calledOnce).to.be.true;
    });
    it('records else option', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        appliedForVaEducationBenefits: true,
      };
      analyticsFunctions.benefitsEligibility(formData);
      expect(push.calledOnce).to.be.false;
    });
  });
  describe('militaryService', () => {
    it('records missing field', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};
      analyticsFunctions.militaryService(formData);
      expect(push.calledOnce).to.be.true;
    });
    it('records else option', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        activeDuty: true,
      };
      analyticsFunctions.militaryService(formData);
      expect(push.calledOnce).to.be.false;
    });
  });
  describe('highTechWorkExp', () => {
    it('records missing field', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {};
      analyticsFunctions.highTechWorkExp(formData);
      expect(push.calledOnce).to.be.true;
    });
    it('records missing field else', () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        currentHighTechnologyEmployment: false,
        pastHighTechnologyEmployment: { name: 'n/a' },
      };
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
    it("Don't record else fields", () => {
      const push = sinon.stub(window.dataLayer, 'push');
      const formData = {
        'view:phoneAndEmail': {
          homePhone: '9898989898',
          emailAddress: 'myemail81566668@unattended.com',
        },
        mailingAddress: {
          street: 'Kenmore Ave 4846',
          city: 'Santo Amaro',
          country: 'STP',
        },
      };
      analyticsFunctions.contactInformation(formData);
      expect(push.calledOnce).to.be.false;
    });
  });
});
