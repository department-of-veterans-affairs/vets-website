import { expect } from 'chai';
import { migrateCardUploadKeys } from '../../config/migrations';

const EXAMPLE_SIP_METADATA = {
  version: 0,
  prefill: true,
  returnUrl: '/signer-type',
};

describe('migrateCardUploadKeys', () => {
  it('should create front and back properties for Medicare Part A/B card', () => {
    const props = {
      formData: {
        applicantMedicarePartAPartBCard: [
          {
            name: 'front.png',
            confirmationCode: 'a49136ca-377c-4b7e-b7ee-e7320ed2ca0b',
            attachmentId: 'Front of Medicare Parts A or B card',
            isEncrypted: false,
          },
          {
            name: 'back.png',
            confirmationCode: 'b49136ca-377c-4b7e-b7ee-e7320ed2ca0b',
            attachmentId: 'Back of Medicare Parts A or B card',
            isEncrypted: false,
          },
        ],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const migrated = migrateCardUploadKeys(JSON.parse(JSON.stringify(props)));
    expect(
      migrated.formData.applicantMedicarePartAPartBCardFront,
    ).to.exist.and.to.have.lengthOf(1);
    expect(
      migrated.formData.applicantMedicarePartAPartBCardBack,
    ).to.exist.and.to.have.lengthOf(1);
  });

  it('should create front and back properties for OHI card', () => {
    const props = {
      formData: {
        applicantOhiCard: [
          {
            name: 'front.png',
            confirmationCode: 'c49136ca-377c-4b7e-b7ee-e7320ed2ca0b',
            attachmentId: 'Front of health insurance card(s)',
            isEncrypted: false,
          },
          {
            name: 'back.png',
            confirmationCode: 'd49136ca-377c-4b7e-b7ee-e7320ed2ca0b',
            attachmentId: 'Back of health insurance card(s)',
            isEncrypted: false,
          },
        ],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const migrated = migrateCardUploadKeys(JSON.parse(JSON.stringify(props)));
    expect(
      migrated.formData.applicantOhiCardFront,
    ).to.exist.and.to.have.lengthOf(1);
    expect(
      migrated.formData.applicantOhiCardBack,
    ).to.exist.and.to.have.lengthOf(1);
  });

  it('should create front and back properties for Medicare Part D card', () => {
    const props = {
      formData: {
        applicantMedicarePartDCard: [
          {
            name: 'front.png',
            confirmationCode: 'a49136ca-377c-4b7e-b7ee-e7320ed2ca0b',
            attachmentId: 'Front of Medicare Part D card',
            isEncrypted: false,
          },
          {
            name: 'back.png',
            confirmationCode: 'b49136ca-377c-4b7e-b7ee-e7320ed2ca0b',
            attachmentId: 'Back of Medicare Part D card',
            isEncrypted: false,
          },
        ],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const migrated = migrateCardUploadKeys(JSON.parse(JSON.stringify(props)));
    expect(
      migrated.formData.applicantMedicarePartDCardFront,
    ).to.exist.and.to.have.lengthOf(1);
    expect(
      migrated.formData.applicantMedicarePartDCardBack,
    ).to.exist.and.to.have.lengthOf(1);
  });

  it('should not modify form data when card uploads are not present', () => {
    const props = {
      formData: {
        applicantName: { first: 'John', last: 'Doe' },
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const migrated = migrateCardUploadKeys(JSON.parse(JSON.stringify(props)));
    expect(JSON.stringify(migrated.formData)).to.eq(
      JSON.stringify(props.formData),
    );
  });

  it('should remove old keynames from form data', () => {
    const props = {
      formData: {
        applicantMedicarePartAPartBCard: [
          {
            name: 'front.png',
            confirmationCode: 'a49136ca-377c-4b7e-b7ee-e7320ed2ca0b',
            attachmentId: 'Front of Medicare Parts A or B card',
            isEncrypted: false,
          },
        ],
        applicantOhiCard: [
          {
            name: 'back.png',
            confirmationCode: 'b49136ca-377c-4b7e-b7ee-e7320ed2ca0b',
            attachmentId: 'Back of Medicare Parts A or B card',
            isEncrypted: false,
          },
        ],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const migrated = migrateCardUploadKeys(JSON.parse(JSON.stringify(props)));
    expect(migrated.formData.applicantMedicarePartAPartBCard).to.be.undefined;
    expect(migrated.formData.applicantOhiCard).to.be.undefined;
  });

  it('should remove old keys from `missingUploads` array if present', () => {
    const props = {
      formData: {
        missingUploads: [
          {
            name: 'applicantMedicarePartAPartBCard',
            path: 'applicant-medicare-upload',
            required: true,
            uploaded: false,
          },
          {
            name: 'applicantOhiCard',
            path: 'applicant-other-insurance-upload',
            required: true,
            uploaded: false,
          },
        ],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const migrated = migrateCardUploadKeys(JSON.parse(JSON.stringify(props)));
    expect(migrated.formData.missingUploads.length).to.eq(0);
  });
});
