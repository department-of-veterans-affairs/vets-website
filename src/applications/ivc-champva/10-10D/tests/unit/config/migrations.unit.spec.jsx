import { expect } from 'chai';
import {
  flattenApplicantSSN,
  migrateCardUploadKeys,
  removeOtherRelationshipSpecification,
  flattenSponsorSSN,
} from '../../../config/migrations';

const EXAMPLE_SIP_METADATA = {
  version: 0,
  prefill: true,
  returnUrl: '/signer-type',
};

describe('flattenApplicantSSN', () => {
  it('should not modify applicantSSN if it is a string', () => {
    const props = {
      formData: { applicants: [{ applicantSSN: '111222333' }] },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    // Deep copying since migration operates on input data
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = flattenApplicantSSN(propsDeepCopy);
    expect(migrated.formData.applicants[0].applicantSSN).to.equal(
      props.formData.applicants[0].applicantSSN,
    );
  });

  it('should flatten ssn + va file number object down to single ssn string', () => {
    const props = {
      formData: {
        applicants: [{ applicantSSN: { ssn: '111222333', vaFileNumber: '' } }],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = flattenApplicantSSN(propsDeepCopy);
    expect(migrated.formData.applicants[0].applicantSSN).to.equal(
      props.formData.applicants[0].applicantSSN.ssn,
    );
  });

  it('should flatten ssn + va file number object down to single ssn string for multiple applicants', () => {
    const props = {
      formData: {
        applicants: [
          { applicantSSN: { ssn: '111222333', vaFileNumber: '' } },
          { applicantSSN: { ssn: '444555666', vaFileNumber: '' } },
        ],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = flattenApplicantSSN(propsDeepCopy);
    expect(migrated.formData.applicants[0].applicantSSN).to.equal(
      props.formData.applicants[0].applicantSSN.ssn,
    );
    expect(migrated.formData.applicants[1].applicantSSN).to.equal(
      props.formData.applicants[1].applicantSSN.ssn,
    );
  });

  it('should fall back to va file number when user did not enter ssn', () => {
    const props = {
      formData: {
        applicants: [{ applicantSSN: { ssn: '', vaFileNumber: '111222333' } }],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = flattenApplicantSSN(propsDeepCopy);
    expect(migrated.formData.applicants[0].applicantSSN).to.equal(
      props.formData.applicants[0].applicantSSN.vaFileNumber,
    );
  });

  it('should set ssn to an empty string if no ssn or va file number exists', () => {
    const props = {
      formData: {
        applicants: [{ applicantSSN: { ssn: '', vaFileNumber: '' } }],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const migrated = flattenApplicantSSN(props);
    expect(migrated.formData.applicants[0].applicantSSN).to.equal('');
  });

  it('should not modify form data if `applicantSSN` property is missing', () => {
    const props = {
      formData: {
        applicants: [
          { applicantName: { first: 'firstname', last: 'lastname' } },
        ],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = flattenApplicantSSN(propsDeepCopy);
    expect(JSON.stringify(migrated.formData)).to.equal(
      JSON.stringify(props.formData),
    );
  });

  it('should gracefully handle undefined ssn or va file number properties', () => {
    const props = {
      formData: {
        applicants: [{ applicantSSN: {} }],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const migrated = flattenApplicantSSN(props);
    expect(migrated.formData.applicants[0].applicantSSN).to.equal('');
  });

  it('should gracefully handle empty formData', () => {
    const props = {
      formData: {},
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const migrated = flattenApplicantSSN(props);
    expect(typeof migrated.formData).to.equal('object');
    expect(Object.keys(migrated.formData).length).to.equal(0);
  });
});

describe('flattenSponsorSSN', () => {
  it('should not modify sponsorSSN if it is a string', () => {
    const props = {
      formData: { ssn: '123123123' },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    // Deep copying since migration operates on input data
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = flattenSponsorSSN(propsDeepCopy);
    expect(migrated.formData.ssn).to.equal(props.formData.ssn);
  });

  it('should flatten ssn + va file number object down to single ssn string', () => {
    const props = {
      formData: {
        ssn: { ssn: '111222333', vaFileNumber: '' },
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = flattenSponsorSSN(propsDeepCopy);
    expect(migrated.formData.ssn).to.equal(props.formData.ssn.ssn);
  });

  it('should fall back to va file number when user did not enter ssn', () => {
    const props = {
      formData: {
        ssn: { ssn: '', vaFileNumber: '111222333' },
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = flattenSponsorSSN(propsDeepCopy);
    expect(migrated.formData.ssn).to.equal(props.formData.ssn.vaFileNumber);
  });

  it('should set ssn to an empty string if no ssn or va file number exists', () => {
    const props = {
      formData: {
        ssn: { ssn: '', vaFileNumber: '' },
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const migrated = flattenSponsorSSN(props);
    expect(migrated.formData.ssn).to.equal('');
  });
});

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

describe('removeOtherRelationshipSpecification', () => {
  it('should clear applicant relationship to sponsor if it is "other"', () => {
    const props = {
      formData: {
        applicants: [
          {
            applicantRelationshipToSponsor: {
              relationshipToVeteran: 'other',
              otherRelationshipToVeteran: 'Grandpa',
            },
          },
          {
            applicantRelationshipToSponsor: {
              relationshipToVeteran: 'child',
            },
          },
        ],
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-10D',
    };
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = removeOtherRelationshipSpecification(propsDeepCopy);
    // Relationships set to 'other' should be entirely gone
    expect(
      migrated.formData.applicants[0].applicantRelationshipToSponsor,
    ).to.equal(undefined);
    // Non-other relationships should be intact
    expect(
      migrated.formData.applicants[1].applicantRelationshipToSponsor
        .relationshipToVeteran,
    ).to.equal(
      props.formData.applicants[1].applicantRelationshipToSponsor
        .relationshipToVeteran,
    );
  });
});
