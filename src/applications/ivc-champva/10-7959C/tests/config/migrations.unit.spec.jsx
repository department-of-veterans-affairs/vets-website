import { expect } from 'chai';
import { migrateCardUploadKeys } from '../../config/migrations';

const EXAMPLE_SIP_METADATA = {
  version: 0,
  prefill: true,
  returnUrl: '/form-signature',
};

describe('migrateCardUploadKeys ', () => {
  it('should create a front and back property when `applicantMedicarePartAPartBCard` is present', () => {
    const props = {
      formData: {
        applicantMedicarePartAPartBCard: [
          {
            name: 'front.png',
            confirmationCode: 'a49136ca-377c-4b7e-b7ee-e7320ed2ca0b',
            attachmentId: 'Front of insurance card',
            isEncrypted: false,
          },
          {
            name: 'back.png',
            confirmationCode: 'b49136ca-377c-4b7e-b7ee-e7320ed2ca0b',
            attachmentId: 'Back of insurance card',
            isEncrypted: false,
          },
        ],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-7959c',
    };
    // Deep copying since migration operates on input data
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = migrateCardUploadKeys(propsDeepCopy);
    expect(
      migrated.formData.applicantMedicarePartAPartBCardFront,
    ).to.exist.and.to.have.lengthOf(1);
    expect(
      migrated.formData.applicantMedicarePartAPartBCardBack,
    ).to.exist.and.to.have.lengthOf(1);
  });
  it('should not modify form data when card uploads are not present', () => {
    const props = {
      formData: {
        applicantName: { first: 'John', last: 'Lastname' },
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-7959c',
    };
    // Deep copying since migration operates on input data
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = migrateCardUploadKeys(propsDeepCopy);
    expect(JSON.stringify(migrated.formData)).to.eq(
      JSON.stringify(props.formData),
    );
  });
  it('should remove all old keynames', () => {
    const props = {
      formData: {
        applicantName: { first: 'John', last: 'Lastname' },
        applicantMedicarePartAPartBCard: [
          {
            name: 'front.png',
            confirmationCode: 'a49136ca-377c-4b7e-b7ee-e7320ed2ca0b',
            attachmentId: 'Front of insurance card',
            isEncrypted: false,
          },
        ],
        primaryInsuranceCard: [
          {
            name: 'back.png',
            confirmationCode: 'b49136ca-377c-4b7e-b7ee-e7320ed2ca0b',
            attachmentId: 'Back of insurance card',
            isEncrypted: false,
          },
        ],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-7959c',
    };
    // Deep copying since migration operates on input data
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = migrateCardUploadKeys(propsDeepCopy);
    expect(migrated.formData.applicantMedicarePartAPartBCard).to.be.undefined;
    expect(migrated.formData.primaryInsuranceCard).to.be.undefined;
  });
  it('should remove old keys from `missingUploads` array if present', () => {
    const props = {
      formData: {
        missingUploads: [
          {
            name: 'applicantMedicarePartAPartBCard',
            path: 'medicare-ab-upload',
            required: true,
            uploaded: false,
          },
        ],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-7959c',
    };
    // Deep copying since migration operates on input data
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = migrateCardUploadKeys(propsDeepCopy);
    expect(migrated.formData.missingUploads.length).to.eq(0);
  });
});
