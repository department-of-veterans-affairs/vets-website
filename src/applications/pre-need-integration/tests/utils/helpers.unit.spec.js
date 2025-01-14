/* eslint-disable mocha/no-exclusive-tests */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ApplicantDescription from 'platform/forms/components/ApplicantDescription';
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
      isApplicantTheSponsorStub.returns(false); // Mocking the function to return false

      const wrapper = shallow(
        React.createElement(sponsorDetailsSubHeader, { formContext, formData }),
      );

      expect(wrapper.find('.sponsorDetailsSummaryBox')).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should not render the summary box when on review page', () => {
      const formContext = { onReviewPage: true };
      const formData = { someKey: 'someValue' };
      isApplicantTheSponsorStub.returns(true); // Mocking the function to return true

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

    // it('should focus the correct file card', done => {
    //   const response = {
    //     data: {
    //       attributes: {
    //         name: 'file1',
    //         confirmationCode: 'abc123',
    //       },
    //     },
    //   };
    //   parseResponse(response);

    //   setTimeout(() => {
    //     const target = $$Stub().find(entry =>
    //       entry.textContent.trim().includes('file1'),
    //     );
    //     console.log('Target:', target); // Add this line to log the target element
    //     if (target) {
    //       expect(target.focus.calledOnce).to.be.false;
    //       expect(focusElementStub.calledOnceWith(target)).to.be.false;
    //     } else {
    //       expect.fail('Target element not found');
    //     }
    //     done();
    //   }, 150);
    // });
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
});
