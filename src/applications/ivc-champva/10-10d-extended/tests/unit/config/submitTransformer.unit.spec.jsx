import { expect } from 'chai';
import formConfig from '../../../config/form';
import transformForSubmit from '../../../config/submitTransformer';
import { toHash } from '../../../../shared/utilities';
import {
  NOT_SHARED,
  FIELD_NAME as SHARED_ADDRESS_FIELD_NAME,
} from '../../../components/FormPages/AddressSelectionPage';

const APPLICANT_SSN = '345345345';
const SSN_HASH = toHash(APPLICANT_SSN);

describe('10-10d-extended transform for submit', () => {
  it('should return passed in relationship if already flat', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          applicants: [{ applicantRelationshipToSponsor: 'Spouse' }],
        },
      }),
    );
    expect(transformed.applicants[0].vetRelationship).to.equal('Spouse');
  });

  it('should flatten relationship details', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          applicants: [
            {
              applicantRelationshipToSponsor: {
                relationshipToVeteran: 'other',
                otherRelationshipToVeteran: 'Sibling',
              },
            },
          ],
        },
      }),
    );
    expect(transformed.applicants[0].vetRelationship).to.equal('Sibling');
  });

  it('should produce a semicolon separated list of relationships for third party certifiers', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          certifierRole: 'other',
          certifierRelationship: {
            relationshipToVeteran: {
              spouse: true,
              parent: true,
              thirdParty: false,
            },
          },
        },
      }),
    );
    expect(transformed.certification.relationship).to.equal('spouse; parent');
  });

  it('should insert blank values as needed', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, { data: {} }),
    );
    expect(transformed.veteran.ssnOrTin).to.equal('');
  });

  it('should set certifier info as primary contact', () => {
    const certifierCert = {
      data: {
        certifierPhone: '1231231234',
        certifierEmail: 'test@example.com',
        certifierName: { first: 'Certifier', last: 'Jones' },
      },
    };
    const transformed = JSON.parse(
      transformForSubmit(formConfig, certifierCert),
    );
    expect(transformed.primaryContactInfo.name.first).to.equal(
      certifierCert.data.certifierName.first,
    );
    expect(transformed.primaryContactInfo.name.last).to.equal(
      certifierCert.data.certifierName.last,
    );
    expect(transformed.primaryContactInfo.phone).to.equal(
      certifierCert.data.certifierPhone,
    );
    expect(transformed.primaryContactInfo.email).to.equal(
      certifierCert.data.certifierEmail,
    );
  });

  it('should set `hasApplicantOver65` to false if all applicants are under 65', () => {
    const testData = { data: { applicants: [{ applicantDob: '2003-01-01' }] } };
    const transformed = JSON.parse(transformForSubmit(formConfig, testData));
    expect(transformed.hasApplicantOver65).to.be.false;
  });

  it('should set `hasApplicantOver65` to true if any applicant is 65 or over', () => {
    const testData = { data: { applicants: [{ applicantDob: '1947-01-01' }] } };
    const transformed = JSON.parse(transformForSubmit(formConfig, testData));
    expect(transformed.hasApplicantOver65).to.be.true;
  });

  it('should format dates from YYYY-MM-DD to MM-DD-YYYY', () => {
    const testData = {
      data: {
        sponsorDob: '1958-01-01',
      },
    };
    const transformed = JSON.parse(transformForSubmit(formConfig, testData));

    // Check sponsor date of birth formatting
    expect(transformed.veteran.dateOfBirth).to.equal('01-01-1958');
  });

  it('should map medicare plans to corresponding applicants', () => {
    const testData = {
      data: {
        applicants: [
          {
            applicantName: {
              first: 'Johnny',
              last: 'Alvin',
            },
            applicantSsn: APPLICANT_SSN,
          },
        ],
        medicare: [
          {
            medicareParticipant: SSN_HASH,
            medicarePlanType: 'c',
            medicarePartCCarrier: 'Advantage Health Solutions',
          },
        ],
      },
    };

    const transformed = JSON.parse(transformForSubmit(formConfig, testData));

    // First applicant should have medicare plan attached
    expect(transformed.applicants[0].medicare).to.be.an('array');
    expect(transformed.applicants[0].medicare.length).to.equal(1);
  });

  it('should map health insurance policies to corresponding applicants', () => {
    const testData = {
      data: {
        applicants: [
          {
            applicantName: {
              first: 'Johnny',
              last: 'Alvin',
            },
            applicantSsn: APPLICANT_SSN,
          },
        ],
        healthInsurance: [
          {
            insuranceType: 'medigap',
            medigapPlan: 'K',
            provider: 'Blue Cross Blue Shield',
            healthcareParticipants: { [SSN_HASH]: true },
          },
        ],
      },
    };

    const transformed = JSON.parse(transformForSubmit(formConfig, testData));

    // First applicant should have health insurance policy attached
    expect(transformed.applicants[0].healthInsurance).to.be.an('array');
    expect(transformed.applicants[0].healthInsurance.length).to.equal(1);
    expect(transformed.applicants[0].healthInsurance[0].provider).to.equal(
      'Blue Cross Blue Shield',
    );
  });

  it('should set applicant Medicare Advantage flag correctly', () => {
    const testData = {
      data: {
        medicare: [
          {
            medicareParticipant: SSN_HASH,
            medicarePlanType: 'c',
            medicarePartCCarrier: 'Advantage Health Solutions',
          },
        ],
        applicants: [
          {
            applicantName: {
              first: 'Johnny',
              last: 'Alvin',
            },
            applicantSsn: APPLICANT_SSN,
          },
        ],
      },
    };

    const transformed = JSON.parse(transformForSubmit(formConfig, testData));
    expect(transformed.applicants[0].applicantMedicareAdvantage).to.be.true;
  });

  it('should set hasOtherHealthInsurance flag correctly', () => {
    const testData = {
      data: {
        applicants: [
          {
            applicantName: {
              first: 'Johnny',
              last: 'Alvin',
            },
            applicantSsn: APPLICANT_SSN,
          },
        ],
        healthInsurance: [
          {
            insuranceType: 'medigap',
            medigapPlan: 'K',
            provider: 'Blue Cross Blue Shield',
            healthcareParticipants: { [SSN_HASH]: true },
          },
        ],
      },
    };

    const transformed = JSON.parse(transformForSubmit(formConfig, testData));
    expect(transformed.applicants[0].hasOtherHealthInsurance).to.be.true;
  });

  it('should handle sponsor deceased status correctly', () => {
    const testData = {
      data: {
        sponsorIsDeceased: true,
        sponsorDOD: '2022-05-15',
        sponsorDeathConditions: true,
      },
    };

    const transformed = JSON.parse(transformForSubmit(formConfig, testData));

    expect(transformed.veteran.sponsorIsDeceased).to.be.true;
    expect(transformed.veteran.dateOfDeath).to.equal('05-15-2022');
    expect(transformed.veteran.isActiveServiceDeath).to.be.true;
  });

  it('should create appropriate certification object for applicant certifier', () => {
    const testData = {
      data: {
        certifierRole: 'applicant',
        certifierName: {
          first: 'Certifier',
          last: 'Jones',
        },
        certifierPhone: '1231231234',
        certifierEmail: 'certifier@email.gov',
      },
    };

    const transformed = JSON.parse(transformForSubmit(formConfig, testData));

    // When certifier is an applicant, certification should only have date
    expect(transformed.certification).to.have.property('date');
    expect(transformed.certification).to.not.have.property('lastName');
  });

  it('should create appropriate certification object for non-applicant certifier', () => {
    const testData = {
      data: {
        certifierRole: 'other',
        certifierName: {
          first: 'Certifier',
          last: 'Jones',
        },
        certifierPhone: '1231231234',
        certifierEmail: 'certifier@email.gov',
      },
    };

    const transformed = JSON.parse(transformForSubmit(formConfig, testData));

    // When certifier is not an applicant, certification should have all fields
    expect(transformed.certification).to.have.property('date');
    expect(transformed.certification).to.have.property('lastName');
    expect(transformed.certification).to.have.property('firstName');
    expect(transformed.certification).to.have.property('phoneNumber');
    expect(transformed.certification.lastName).to.equal('Jones');
  });

  it('should set the correct form ID in output JSON', () => {
    const testData = {
      data: {
        sponsorName: {
          first: 'Joe',
          last: 'Johnson',
        },
      },
    };

    const transformed = JSON.parse(transformForSubmit(formConfig, testData));

    expect(transformed.formNumber).to.equal(formConfig.formId);
  });

  it('should include statement of truth signature in output', () => {
    const testData = {
      data: {
        statementOfTruthSignature: 'Certifier Jones',
      },
    };

    const transformed = JSON.parse(transformForSubmit(formConfig, testData));

    expect(typeof transformed.statementOfTruthSignature).to.eq('string');
    expect(transformed.statementOfTruthSignature.length > 0).to.be.true;
  });

  it('should set certifier role in output', () => {
    const testData = {
      data: {
        certifierRole: 'other',
        certifierName: {
          first: 'Certifier',
          last: 'Jones',
        },
      },
    };

    const transformed = JSON.parse(transformForSubmit(formConfig, testData));

    expect(transformed.certifierRole).to.equal('other');
  });

  it('should map `sponsorEmail` into veteran data', () => {
    const testData = { data: { sponsorEmail: 'veteran@example.com' } };
    const { veteran } = JSON.parse(transformForSubmit(formConfig, testData));
    expect(veteran.email).to.equal('veteran@example.com');
  });

  it('should default veteran email to empty string when `sponsorEmail` is omitted', () => {
    const testData = { data: {} };
    const { veteran } = JSON.parse(transformForSubmit(formConfig, testData));
    expect(veteran.email).to.equal('');
  });

  describe('address formatting', () => {
    it('should properly format sponsor address fields when address is not shared', () => {
      const testData = {
        data: {
          [SHARED_ADDRESS_FIELD_NAME]: NOT_SHARED,
          sponsorAddress: {
            street: '123 Main Street',
            street2: 'Apartment 4B',
            city: 'Anytown',
            state: 'CA',
            postalCode: '12345',
            country: 'USA',
          },
        },
      };

      const transformed = JSON.parse(transformForSubmit(formConfig, testData));

      // Verify that the street fields were combined
      expect(transformed.veteran.address.streetCombined).to.contain(
        '123 Main Street',
      );
      expect(transformed.veteran.address.streetCombined).to.contain(
        'Apartment 4B',
      );

      // Original fields should be preserved
      expect(transformed.veteran.address.street).to.equal('123 Main Street');
      expect(transformed.veteran.address.street2).to.equal('Apartment 4B');
      expect(transformed.veteran.address.city).to.equal('Anytown');
      expect(transformed.veteran.address.state).to.equal('CA');
      expect(transformed.veteran.address.postalCode).to.equal('12345');
    });

    it('should properly format sponsor address fields when address is shared', () => {
      const testAddress = {
        street: '123 Main Street',
        street2: 'Apartment 4B',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'USA',
      };
      const testData = {
        data: {
          [SHARED_ADDRESS_FIELD_NAME]: JSON.stringify(testAddress),
          sponsorAddress: testAddress,
        },
      };

      const transformed = JSON.parse(transformForSubmit(formConfig, testData));

      // Verify that the street fields were combined
      expect(transformed.veteran.address.streetCombined).to.contain(
        '123 Main Street',
      );
      expect(transformed.veteran.address.streetCombined).to.contain(
        'Apartment 4B',
      );

      // Original fields should be preserved
      expect(transformed.veteran.address.street).to.equal('123 Main Street');
      expect(transformed.veteran.address.street2).to.equal('Apartment 4B');
      expect(transformed.veteran.address.city).to.equal('Anytown');
      expect(transformed.veteran.address.state).to.equal('CA');
      expect(transformed.veteran.address.postalCode).to.equal('12345');
    });
  });
});
