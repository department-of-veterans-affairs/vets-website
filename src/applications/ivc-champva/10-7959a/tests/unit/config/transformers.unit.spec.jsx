import { expect } from 'chai';
import sinon from 'sinon-v20';
import * as recordEventModule from 'platform/monitoring/record-event';
import { ID_NUMBER_OPTIONS } from '../../../chapters/resubmission';
import formConfig from '../../../config/form';
import mockData from '../../e2e/fixtures/data/medical-claim.json';
import transformForSubmit from '../../../config/submitTransformer';

describe('Submit transformer', () => {
  it('should add the file type to submitted files', () => {
    const result = JSON.parse(transformForSubmit(formConfig, mockData));
    const attachmentIds = result.supportingDocs.map(o => o.attachmentId);
    expect(attachmentIds.length).to.eq(2);
    expect(attachmentIds.includes('MEDDOCS')).to.be.true;
    expect(attachmentIds.includes('EOB')).to.be.true;
  });

  it('should set primaryContact name to false if none present', () => {
    const result = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          applicantAddress: { street: '' },
          certifierAddress: { street: '' },
        },
      }),
    );
    expect(result.primaryContactInfo.name).to.be.false;
  });

  it('should set primaryContact name to sponsor if certifierRole is `sponsor`', () => {
    const result = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          certifierRole: 'sponsor',
          sponsorName: { first: 'Jim' },
          applicantAddress: { street: '' },
          certifierAddress: { street: '' },
        },
      }),
    );
    expect(result.primaryContactInfo.name.first).to.equal('Jim');
  });

  context('Claim status event tracking', () => {
    let recordEventStub;

    beforeEach(() => {
      recordEventStub = sinon.stub(recordEventModule, 'default');
    });

    afterEach(() => recordEventStub.restore());

    const submitForm = ({ overrides = {}, disableAnalytics = false } = {}) => {
      const baseData = {
        'view:champvaEnableClaimResubmitQuestion': true,
        applicantAddress: { street: '' },
        certifierAddress: { street: '' },
      };
      transformForSubmit(
        formConfig,
        { data: { ...baseData, ...overrides } },
        disableAnalytics,
      );
    };

    it('should fire recordEvent with new claim event when claimStatus is new', () => {
      submitForm({ overrides: { claimStatus: 'new' } });
      sinon.assert.calledOnceWithExactly(recordEventStub, {
        event: '10-7959a_new_claim',
      });
    });

    it('should fire recordEvent with reopen claim event when pdiOrClaimNumber matches control option', () => {
      submitForm({
        overrides: {
          claimStatus: 'resubmission',
          pdiOrClaimNumber: ID_NUMBER_OPTIONS[1],
        },
      });
      sinon.assert.calledOnceWithExactly(recordEventStub, {
        event: '10-7959a_reopen_claim_control_number',
      });
    });

    it('should fire recordEvent with resubmission event when claimStatus is resubmission with PDI', () => {
      submitForm({
        overrides: {
          claimStatus: 'resubmission',
          pdiOrClaimNumber: ID_NUMBER_OPTIONS[0],
        },
      });
      sinon.assert.calledOnceWithExactly(recordEventStub, {
        event: '10-7959a_resubmission_pdi_number',
      });
    });

    it('should not fire recordEvent when disableAnalytics is true', () => {
      submitForm({ overrides: { claimStatus: 'new' }, disableAnalytics: true });
      sinon.assert.notCalled(recordEventStub);
    });
  });
});
