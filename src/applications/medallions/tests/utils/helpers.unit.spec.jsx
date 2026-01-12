import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import * as helpers from '../../utils/helpers';
import { parseResponse } from '../../utils/helpers';

describe('medallions/utils/helpers', () => {
  describe('validateVetRadioOtherComment', () => {
    it('should add error if relation is "other" and otherRelation is missing', () => {
      const errors = { otherRelation: { addError: sinon.spy() } };
      const formData = { relationToVetRadio: 'other' };
      helpers.validateVetRadioOtherComment(formData, errors);
      expect(
        errors.otherRelation.addError.calledWith('You must provide a response'),
      ).to.be.true;
    });

    it('should add error if relation is "other" and otherRelation is too long', () => {
      const errors = { otherRelation: { addError: sinon.spy() } };
      const formData = {
        relationToVetRadio: 'other',
        otherRelation: 'a'.repeat(51),
      };
      helpers.validateVetRadioOtherComment(formData, errors);
      expect(
        errors.otherRelation.addError.calledWith(
          'Character limit exceeded. Maximum 50 characters allowed.',
        ),
      ).to.be.true;
    });

    it('should not add error if relation is not "other"', () => {
      const errors = { otherRelation: { addError: sinon.spy() } };
      const formData = { relationToVetRadio: 'familyMember' };
      helpers.validateVetRadioOtherComment(formData, errors);
      expect(errors.otherRelation.addError.called).to.be.false;
    });

    it('should not add error if relation is "other" and otherRelation is valid', () => {
      const errors = { otherRelation: { addError: sinon.spy() } };
      const formData = { relationToVetRadio: 'other', otherRelation: 'Friend' };
      helpers.validateVetRadioOtherComment(formData, errors);
      expect(errors.otherRelation.addError.called).to.be.false;
    });
  });

  describe('supportingDocsInfo', () => {
    it('should render supporting docs info', () => {
      const wrapper = shallow(helpers.supportingDocsInfo({}));
      expect(wrapper.text()).to.include(
        'On the next screen, we’ll ask you to submit supporting documents',
      );
      expect(
        wrapper.find(
          'a[href="https://www.va.gov/records/discharge-documents/"]',
        ),
      ).to.have.lengthOf(1);
      wrapper.unmount();
    });
  });

  describe('createPayload', () => {
    it('should add password if provided', () => {
      const file = new Blob(['test'], { type: 'text/plain' });
      const payload = helpers.createPayload(file, 'form123', 'secret');
      expect(payload.get('password')).to.equal('secret');
    });
  });

  describe('parseResponse', () => {
    let focusElementStub;
    let $$Stub;

    beforeEach(() => {
      focusElementStub = sinon.stub(window, 'focusElement');
      $$Stub = sinon
        .stub(window, '$$')
        .returns([
          { textContent: 'file1', focus: sinon.spy() },
          { textContent: 'file2', focus: sinon.spy() },
        ]);
    });

    afterEach(() => {
      focusElementStub.restore();
      $$Stub.restore();
    });

    it('should return the correct name and confirmationCode', () => {
      const response = {
        data: {
          attributes: {
            name: 'file1',
            confirmationCode: 'abc123',
          },
        },
      };
      const result = parseResponse(response);

      expect(result.name).to.equal('file1');
      expect(result.confirmationCode).to.equal('abc123');
    });
  });

  describe('isUserSignedIn', () => {
    it('should return true if isLoggedIn is true', () => {
      expect(
        helpers.isUserSignedIn({ 'view:loginState': { isLoggedIn: true } }),
      ).to.be.true;
    });
    it('should return false if isLoggedIn is false', () => {
      expect(
        helpers.isUserSignedIn({ 'view:loginState': { isLoggedIn: false } }),
      ).to.be.false;
    });
    it('should return undefined if formData is undefined', () => {
      expect(helpers.isUserSignedIn(undefined)).to.be.undefined;
    });
  });

  describe('ApplicantNameHeader', () => {
    it('should render the header', () => {
      const wrapper = shallow(<helpers.ApplicantNameHeader />);
      expect(wrapper.text()).to.include(
        'Confirm the personal information we have on file for you',
      );
      expect(wrapper.find('h3')).to.have.lengthOf(1);
      wrapper.unmount();
    });
  });

  describe('ApplicantNameNote', () => {
    it('should render the note', () => {
      const wrapper = shallow(<helpers.ApplicantNameNote />);
      expect(wrapper.find('[data-testid="default-note"]')).to.have.lengthOf(1);
      expect(wrapper.text()).to.include('To protect your personal information');
      wrapper.unmount();
    });
  });

  describe('dateOfDeathValidation', () => {
    it('should add error if date of death is before date of birth', () => {
      const errors = { veteranDateOfDeath: { addError: sinon.spy() } };
      const fields = {
        veteranDateOfBirth: '2000-01-01',
        veteranDateOfDeath: '1990-01-01',
      };
      helpers.dateOfDeathValidation(errors, fields);
      expect(
        errors.veteranDateOfDeath.addError.calledWith(
          'The Veteran’s date of death must be after the Veteran’s date of birth.',
        ),
      ).to.be.true;
    });

    it('should add error if less than 16 years between birth and death', () => {
      const errors = { veteranDateOfDeath: { addError: sinon.spy() } };
      const fields = {
        veteranDateOfBirth: '2000-01-01',
        veteranDateOfDeath: '2010-01-01',
      };
      helpers.dateOfDeathValidation(errors, fields);
      expect(
        errors.veteranDateOfDeath.addError.calledWith(
          'From date of birth to date of death must be at least 16 years.',
        ),
      ).to.be.true;
    });

    it('should not add error if dates are valid', () => {
      const errors = { veteranDateOfDeath: { addError: sinon.spy() } };
      const fields = {
        veteranDateOfBirth: '2000-01-01',
        veteranDateOfDeath: '2020-01-01',
      };
      helpers.dateOfDeathValidation(errors, fields);
      expect(errors.veteranDateOfDeath.addError.called).to.be.false;
    });
  });

  describe('validateSSN', () => {
    it('should add error if SSN is invalid', () => {
      const errors = { addError: sinon.spy() };
      const ssn = '123';
      const stub = sinon.stub(helpers, 'isValidSSN').returns(false);
      helpers.validateSSN(errors, ssn);
      expect(
        errors.addError.calledWith(
          'Please enter a valid 9 digit Social Security number (dashes allowed)',
        ),
      ).to.be.true;
      stub.restore();
    });

    it('should not add error if SSN is empty', () => {
      const errors = { addError: sinon.spy() };
      helpers.validateSSN(errors, '');
      expect(errors.addError.called).to.be.false;
    });
  });

  describe('formatPhone', () => {
    it('should return "Not provided" for null input', () => {
      expect(helpers.formatPhone(null)).to.equal('Not provided');
    });

    it('should return "Not provided" for undefined input', () => {
      expect(helpers.formatPhone(undefined)).to.equal('Not provided');
    });

    it('should return "Not provided" for empty string', () => {
      expect(helpers.formatPhone('')).to.equal('Not provided');
    });

    it('should format a valid 10-digit phone number without special characters', () => {
      expect(helpers.formatPhone('1234567890')).to.equal('123-456-7890');
    });

    it('should format a phone number with parentheses and spaces', () => {
      expect(helpers.formatPhone('(123) 456-7890')).to.equal('123-456-7890');
    });

    it('should format a phone number with dashes', () => {
      expect(helpers.formatPhone('123-456-7890')).to.equal('123-456-7890');
    });

    it('should format a phone number with dots', () => {
      expect(helpers.formatPhone('123.456.7890')).to.equal('123-456-7890');
    });

    it('should format a phone number with mixed special characters', () => {
      expect(helpers.formatPhone('(123)-456.7890')).to.equal('123-456-7890');
    });

    it('should return phone as-is if it has less than 10 digits', () => {
      expect(helpers.formatPhone('123456789')).to.equal('123456789');
    });

    it('should return phone as-is if it has more than 10 digits', () => {
      expect(helpers.formatPhone('12345678901')).to.equal('12345678901');
    });

    it('should return phone as-is if it contains letters', () => {
      expect(helpers.formatPhone('123-ABC-7890')).to.equal('123-ABC-7890');
    });

    it('should handle phone numbers with only special characters', () => {
      expect(helpers.formatPhone('---')).to.equal('---');
    });
  });
});
