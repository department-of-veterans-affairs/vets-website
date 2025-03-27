/* eslint-disable mocha/no-exclusive-tests */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ApplicantDescription from 'platform/forms/components/ApplicantDescription';
import { render } from '@testing-library/react';
import {
  transform,
  ApplicantDescriptionWrapper,
  militaryDetailsSubHeader,
  veteranApplicantDetailsSummary,
  sponsorDetailsSubHeader,
  createPayload,
  parseResponse,
  applicantsMailingAddressHasState,
  sponsorMailingAddressHasState,
  isSponsorDeceased,
  isSpouse,
  isUnmarriedChild,
  isVeteranAndHasServiceName,
  isNotVeteranAndHasServiceName,
  buriedWSponsorsEligibility,
  requiresSponsorInfo,
  hasServiceRecord,
  formatName,
  claimantHeader,
  validateMilitaryHistory,
  addressConfirmationRenderLine,
} from '../../utils/helpers';
import * as utils from '../../utils/helpers';

describe('Preneed helpers', () => {
  describe('transform', () => {
    it('should remove view fields', () => {
      const data = JSON.parse(
        transform(
          {},
          {
            data: {
              application: {
                claimant: {},
                veteran: {},
                'view:testing': 'asdfadf',
              },
            },
          },
        ),
      );

      expect(data.application['view:testing']).to.be.undefined;
    });

    it('should populate service name', () => {
      const data = JSON.parse(
        transform(
          {},
          {
            data: {
              application: {
                claimant: {},
                veteran: {
                  currentName: 'testing',
                },
                'view:testing': 'asdfadf',
              },
            },
          },
        ),
      );

      expect(data.application.veteran.serviceName).to.equal(
        data.application.veteran.currentName,
      );
    });

    it('should remove partial addresses', () => {
      const data = JSON.parse(
        transform(
          {},
          {
            data: {
              application: {
                claimant: {
                  address: {
                    country: 'USA',
                    city: 'test',
                  },
                },
                veteran: {},
              },
            },
          },
        ),
      );

      expect(data.application.claimant.address).to.be.undefined;
    });
  });

  describe('ApplicantDescriptionWrapper', () => {
    it('should render ApplicantDescription with formContext prop', () => {
      const formContext = { someKey: 'someValue' };
      const wrapper = shallow(
        React.createElement(ApplicantDescriptionWrapper, { formContext }),
      );

      expect(wrapper.find(ApplicantDescription)).to.have.lengthOf(1);
      expect(wrapper.find(ApplicantDescription).prop('formContext')).to.equal(
        formContext,
      );
      wrapper.unmount();
    });
  });

  describe('militaryDetailsSubHeader', () => {
    it('should render "Applicant’s military details" when applicantRelationshipToClaimant is "Authorized Agent/Rep"', () => {
      const formData = {
        formData: {
          applicant: {
            applicantRelationshipToClaimant: 'Authorized Agent/Rep',
          },
        },
      };
      const wrapper = shallow(
        React.createElement(militaryDetailsSubHeader, formData),
      );

      expect(wrapper.find('h3').text()).to.equal(
        'Applicant’s military details',
      );
      wrapper.unmount();
    });

    it('should render "Your military details" when applicantRelationshipToClaimant is not "Authorized Agent/Rep"', () => {
      const formData = {
        formData: { applicant: { applicantRelationshipToClaimant: 'Other' } },
      };
      const wrapper = shallow(
        React.createElement(militaryDetailsSubHeader, formData),
      );

      expect(wrapper.find('h3').text()).to.equal('Your military details');
      wrapper.unmount();
    });
  });

  describe('veteranApplicantDetailsSummary', () => {
    it('should render the summary box when user is logged in and not on review page', () => {
      const formContext = { isLoggedIn: true, onReviewPage: false };
      const wrapper = shallow(
        React.createElement(veteranApplicantDetailsSummary, { formContext }),
      );

      expect(
        wrapper.find('.veteranApplicantDetailsSummaryBox'),
      ).to.have.lengthOf(1);
      expect(
        wrapper.find('p.veteranApplicantDetailsSummaryBoxText').text(),
      ).to.equal(
        'We’ve prefilled some of your information from your account. If you need to correct anything, you can edit the form fields below.',
      );
      wrapper.unmount();
    });

    it('should not render the summary box when user is not logged in', () => {
      const formContext = { isLoggedIn: false, onReviewPage: false };
      const wrapper = shallow(
        React.createElement(veteranApplicantDetailsSummary, { formContext }),
      );

      expect(
        wrapper.find('.veteranApplicantDetailsSummaryBox'),
      ).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should not render the summary box when user is on review page', () => {
      const formContext = { isLoggedIn: true, onReviewPage: true };
      const wrapper = shallow(
        React.createElement(veteranApplicantDetailsSummary, { formContext }),
      );

      expect(
        wrapper.find('.veteranApplicantDetailsSummaryBox'),
      ).to.have.lengthOf(0);
      wrapper.unmount();
    });
  });

  describe('sponsorDetailsSubHeader', () => {
    let isApplicantTheSponsorStub;

    beforeEach(() => {
      isApplicantTheSponsorStub = sinon.stub(utils, 'isApplicantTheSponsor');
    });

    afterEach(() => {
      isApplicantTheSponsorStub.restore();
    });

    it('should not render the summary box when applicant is not the sponsor', () => {
      const formContext = { onReviewPage: false };
      const formData = { someKey: 'someValue' };
      isApplicantTheSponsorStub.returns(false);

      const wrapper = shallow(
        React.createElement(sponsorDetailsSubHeader, { formContext, formData }),
      );

      expect(wrapper.find('.sponsorDetailsSummaryBox')).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should not render the summary box when on review page', () => {
      const formContext = { onReviewPage: true };
      const formData = { someKey: 'someValue' };
      isApplicantTheSponsorStub.returns(true);

      const wrapper = shallow(
        React.createElement(sponsorDetailsSubHeader, { formContext, formData }),
      );

      expect(wrapper.find('.sponsorDetailsSummaryBox')).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should always render the sponsor details subheader', () => {
      const formContext = { onReviewPage: false };
      const formData = { someKey: 'someValue' };

      const wrapper = shallow(
        React.createElement(sponsorDetailsSubHeader, { formContext, formData }),
      );

      expect(wrapper.find('.sponsorDetailsSubHeader')).to.have.lengthOf(1);
      expect(wrapper.find('h3.vads-u-font-size--h5').text()).to.equal(
        'Sponsor details',
      );
      wrapper.unmount();
    });
  });

  describe('createPayload', () => {
    it('should create a FormData payload with form_id and file', () => {
      const file = new Blob(['file content'], { type: 'text/plain' });
      const formId = '12345';
      const payload = createPayload(file, formId);

      expect(payload.get('form_id')).to.equal(formId);
      const fileFromPayload = payload.get('file');
      expect(fileFromPayload.size).to.equal(file.size);
      expect(fileFromPayload.type).to.equal(file.type);
    });

    it('should include password in the payload if provided', () => {
      const file = new Blob(['file content'], { type: 'text/plain' });
      const formId = '12345';
      const password = 'secret';
      const payload = createPayload(file, formId, password);

      expect(payload.get('password')).to.equal(password);
    });

    it('should not include password in the payload if not provided', () => {
      const file = new Blob(['file content'], { type: 'text/plain' });
      const formId = '12345';
      const payload = createPayload(file, formId);

      expect(payload.has('password')).to.be.false;
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

  describe('applicantsMailingAddressHasState', () => {
    it('should return true if country is USA', () => {
      const item = {
        application: { claimant: { address: { country: 'USA' } } },
      };
      expect(applicantsMailingAddressHasState(item)).to.be.true;
    });

    it('should return true if country is CAN', () => {
      const item = {
        application: { claimant: { address: { country: 'CAN' } } },
      };
      expect(applicantsMailingAddressHasState(item)).to.be.true;
    });

    it('should return false if country is not USA or CAN', () => {
      const item = {
        application: { claimant: { address: { country: 'MEX' } } },
      };
      expect(applicantsMailingAddressHasState(item)).to.be.false;
    });
  });

  describe('sponsorMailingAddressHasState', () => {
    it('should return true if country is USA', () => {
      const item = {
        application: { veteran: { address: { country: 'USA' } } },
      };
      expect(sponsorMailingAddressHasState(item)).to.be.true;
    });

    it('should return true if country is CAN', () => {
      const item = {
        application: { veteran: { address: { country: 'CAN' } } },
      };
      expect(sponsorMailingAddressHasState(item)).to.be.true;
    });

    it('should return false if country is not USA or CAN', () => {
      const item = {
        application: { veteran: { address: { country: 'MEX' } } },
      };
      expect(sponsorMailingAddressHasState(item)).to.be.false;
    });
  });

  describe('isSponsorDeceased', () => {
    it('should return true if isDeceased is yes', () => {
      const item = { application: { veteran: { isDeceased: 'yes' } } };
      expect(isSponsorDeceased(item)).to.be.true;
    });

    it('should return false if isDeceased is not yes', () => {
      const item = { application: { veteran: { isDeceased: 'no' } } };
      expect(isSponsorDeceased(item)).to.be.false;
    });
  });

  describe('isSpouse', () => {
    it('should return true if relationshipToVet is husband', () => {
      const item = {
        application: { claimant: { relationshipToVet: 'husband' } },
      };
      expect(isSpouse(item)).to.be.true;
    });

    it('should return true if relationshipToVet is wife', () => {
      const item = { application: { claimant: { relationshipToVet: 'wife' } } };
      expect(isSpouse(item)).to.be.true;
    });

    it('should return false if relationshipToVet is not husband or wife', () => {
      const item = {
        application: { claimant: { relationshipToVet: 'daughter' } },
      };
      expect(isSpouse(item)).to.be.false;
    });
  });

  describe('isUnmarriedChild', () => {
    it('should return true if relationshipToVet is daughter', () => {
      const item = {
        application: { claimant: { relationshipToVet: 'daughter' } },
      };
      expect(isUnmarriedChild(item)).to.be.true;
    });

    it('should return true if relationshipToVet is son', () => {
      const item = { application: { claimant: { relationshipToVet: 'son' } } };
      expect(isUnmarriedChild(item)).to.be.true;
    });

    it('should return true if relationshipToVet is stepdaughter', () => {
      const item = {
        application: { claimant: { relationshipToVet: 'stepdaughter' } },
      };
      expect(isUnmarriedChild(item)).to.be.true;
    });

    it('should return true if relationshipToVet is stepson', () => {
      const item = {
        application: { claimant: { relationshipToVet: 'stepson' } },
      };
      expect(isUnmarriedChild(item)).to.be.true;
    });

    it('should return false if relationshipToVet is not daughter, son, stepdaughter, or stepson', () => {
      const item = { application: { claimant: { relationshipToVet: 'wife' } } };
      expect(isUnmarriedChild(item)).to.be.false;
    });
  });

  describe('isVeteranAndHasServiceName', () => {
    it('should return false if isVeteran is false', () => {
      const item = {
        application: { veteran: { 'view:hasServiceName': true } },
      };
      expect(isVeteranAndHasServiceName(item)).to.be.false;
    });

    it('should return false if hasServiceName is false', () => {
      const item = {
        application: { veteran: { 'view:hasServiceName': false } },
      };
      expect(isVeteranAndHasServiceName(item)).to.be.false;
    });
  });

  describe('isNotVeteranAndHasServiceName', () => {
    it('should return true if isVeteran is false and hasServiceName is true', () => {
      const item = {
        application: { veteran: { 'view:hasServiceName': true } },
      };
      expect(isNotVeteranAndHasServiceName(item)).to.be.true;
    });

    it('should return false if hasServiceName is false', () => {
      const item = {
        application: { veteran: { 'view:hasServiceName': false } },
      };
      expect(isNotVeteranAndHasServiceName(item)).to.be.false;
    });
  });

  describe('buriedWSponsorsEligibility', () => {
    it('should return true if hasCurrentlyBuried is 1', () => {
      const item = { application: { hasCurrentlyBuried: '1' } };
      expect(buriedWSponsorsEligibility(item)).to.be.true;
    });

    it('should return false if hasCurrentlyBuried is not 1', () => {
      const item = { application: { hasCurrentlyBuried: '0' } };
      expect(buriedWSponsorsEligibility(item)).to.be.false;
    });
  });

  describe('requiresSponsorInfo', () => {
    it('should return true if sponsor is undefined', () => {
      const item = { 'view:sponsor': undefined };
      expect(requiresSponsorInfo(item)).to.be.true;
    });

    it('should return true if sponsor is "Other"', () => {
      const item = { 'view:sponsor': 'Other' };
      expect(requiresSponsorInfo(item)).to.be.true;
    });

    it('should return false if sponsor is defined and not "Other"', () => {
      const item = { 'view:sponsor': 'SponsorName' };
      expect(requiresSponsorInfo(item)).to.be.false;
    });
  });

  describe('hasServiceRecord', () => {
    it('should return true if serviceRecords is defined and not empty', () => {
      const item = { serviceRecords: [{ record: 'record1' }] };
      expect(hasServiceRecord(item)).to.be.true;
    });

    it('should return true if formData.serviceRecords is defined and not empty', () => {
      const item = { formData: { serviceRecords: [{ record: 'record1' }] } };
      expect(hasServiceRecord(item)).to.be.true;
    });

    it('should return false if serviceRecords and formData.serviceRecords are undefined', () => {
      const item = {};
      expect(hasServiceRecord(item)).to.be.false;
    });

    it('should return false if serviceRecords and formData.serviceRecords are empty', () => {
      const item = { serviceRecords: [], formData: { serviceRecords: [] } };
      expect(hasServiceRecord(item)).to.be.false;
    });
  });

  describe('formatName', () => {
    it('should format the name correctly with first, middle, last, and suffix', () => {
      const name = { first: 'John', middle: 'A', last: 'Doe', suffix: 'Jr.' };
      expect(formatName(name)).to.equal('John A Doe, Jr.');
    });

    it('should format the name correctly without middle and suffix', () => {
      const name = { first: 'John', last: 'Doe' };
      expect(formatName(name)).to.equal('John Doe');
    });

    it('should format the name correctly with only first and last', () => {
      const name = { first: 'John', last: 'Doe' };
      expect(formatName(name)).to.equal('John Doe');
    });

    it('should return undefined if first and last are not provided', () => {
      const name = { middle: 'A', suffix: 'Jr.' };
      expect(formatName(name)).to.be.undefined;
    });
  });

  describe('claimantHeader', () => {
    it('should render the claimant name in an h4 element', () => {
      const formData = { claimant: { name: { first: 'John', last: 'Doe' } } };
      const header = claimantHeader({ formData });
      expect(header.type).to.equal('h4');
      expect(header.props.className).to.equal('highlight');
      expect(header.props.children).to.equal('John Doe');
    });
  });

  describe('validateMilitaryHistory', () => {
    let isVeteranStub;
    let isAuthorizedAgentStub;
    let errors;

    beforeEach(() => {
      isVeteranStub = sinon.stub(utils, 'isVeteran');
      isAuthorizedAgentStub = sinon.stub(utils, 'isAuthorizedAgent');
      errors = {
        highestRank: { addError: sinon.spy() },
        dateRange: {
          from: { addError: sinon.spy() },
          to: { addError: sinon.spy() },
        },
      };
    });

    afterEach(() => {
      isVeteranStub.restore();
      isAuthorizedAgentStub.restore();
    });

    it('should add error if serviceBranch is undefined and highestRank is defined for self', () => {
      const serviceRecords = {
        highestRank: 'rank',
        dateRange: { from: '', to: '' },
      };
      const useAllFormData = {
        application: { claimant: { dateOfBirth: '2000-01-01' } },
      };
      isVeteranStub.returns(true);
      isAuthorizedAgentStub.returns(false);

      validateMilitaryHistory(errors, serviceRecords, useAllFormData);

      expect(errors.highestRank.addError.calledOnce).to.be.true;
    });

    it('should add error if serviceBranch is undefined and highestRank is defined for applicant', () => {
      const serviceRecords = {
        highestRank: 'rank',
        dateRange: { from: '', to: '' },
      };
      const useAllFormData = {
        application: { claimant: { dateOfBirth: '2000-01-01' } },
      };
      isVeteranStub.returns(true);
      isAuthorizedAgentStub.returns(true);

      validateMilitaryHistory(errors, serviceRecords, useAllFormData);

      expect(errors.highestRank.addError.calledOnce).to.be.true;
    });

    it('should add error if serviceBranch is undefined and highestRank is defined for sponsor', () => {
      const serviceRecords = {
        highestRank: 'rank',
        dateRange: { from: '', to: '' },
      };
      const useAllFormData = {
        application: { veteran: { dateOfBirth: '2000-01-01' } },
      };
      isVeteranStub.returns(false);

      validateMilitaryHistory(errors, serviceRecords, useAllFormData);

      expect(errors.highestRank.addError.calledOnce).to.be.true;
      expect(
        errors.highestRank.addError.calledWith(
          "Select Sponsor's branch of service before selecting the Sponsor's highest rank attained.",
        ),
      ).to.be.true;
    });

    it('should add error if highestRank is not valid for the serviceBranch', () => {
      const serviceRecords = {
        serviceBranch: 'branch',
        highestRank: 'invalidRank',
        dateRange: { from: '', to: '' },
      };
      const useAllFormData = {};
      const jsonData = [
        { 'Branch Of Service Code': 'branch', 'Rank Code': 'validRank' },
      ];
      const serviceLabels = { branch: 'Branch' };

      global.jsonData = jsonData;
      global.serviceLabels = serviceLabels;

      validateMilitaryHistory(errors, serviceRecords, useAllFormData);

      expect(errors.highestRank.addError.calledOnce).to.be.true;
      expect(
        errors.highestRank.addError.calledWith(
          'This is not a valid rank for Branch',
        ),
      ).to.be.false;
    });

    it('should not add error if service start date is before date of birth', () => {
      const serviceRecords = {
        dateRange: { from: '1999-01-01', to: '2001-01-01' },
      };
      const useAllFormData = {
        application: { claimant: { dateOfBirth: '2000-01-01' } },
      };
      isVeteranStub.returns(true);
      isAuthorizedAgentStub.returns(false);

      validateMilitaryHistory(errors, serviceRecords, useAllFormData);

      expect(errors.dateRange.from.addError.calledOnce).to.be.false;
    });

    it('should not add error if service end date is before date of birth', () => {
      const serviceRecords = {
        dateRange: { from: '2000-01-01', to: '1999-01-01' },
      };
      const useAllFormData = {
        application: { claimant: { dateOfBirth: '2000-01-01' } },
      };
      isVeteranStub.returns(true);
      isAuthorizedAgentStub.returns(false);

      validateMilitaryHistory(errors, serviceRecords, useAllFormData);

      expect(errors.dateRange.to.addError.calledOnce).to.be.false;
    });
  });
});

describe('addressConfirmationRenderLine', () => {
  it('should render content with a line break when content is provided', () => {
    const content = 'Test Content';
    const { container } = render(addressConfirmationRenderLine(content));
    expect(container.innerHTML).to.equal('Test Content<br>');
  });

  it('should return null when content is not provided', () => {
    const content = null;
    const result = addressConfirmationRenderLine(content);
    expect(result).to.be.null;
  });
});
