import { expect } from 'chai';
import { flattenApplicantSSN } from '../../../config/migrations';

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
