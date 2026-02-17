import { expect } from 'chai';
import sinon from 'sinon-v20';
import formConfig from '../../../config/form';
import transformForSubmit from '../../../config/submitTransformer';
import mockData from '../../e2e/fixtures/data/test-data.json';
import mockDataRev2025 from '../../e2e/fixtures/data/test-data.rev2025.json';

describe('10-7959C submit transformer', () => {
  let clock;

  beforeEach(() => {
    // mock the current date for consistent certification date testing
    clock = sinon.useFakeTimers(new Date('2026-01-08').getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  const parseTransformed = form =>
    JSON.parse(transformForSubmit(formConfig, form));

  const createForm = (data, toggleValue = false) => ({
    data: {
      ...data,
      'view:champvaForm107959cRev2025': toggleValue,
    },
  });

  context('common transformations', () => {
    it('should add the form number to the data', () => {
      const form = createForm(mockData.data);
      const result = parseTransformed(form);
      expect(result.formNumber).to.equal(formConfig.formId);
    });

    it('should set certification date to current date in MM-DD-YYYY format', () => {
      const form = createForm(mockData.data);
      const result = parseTransformed(form);
      expect(result.certificationDate).to.equal('01-08-2026');
    });

    it('should transform all date fields from YYYY-MM-DD to MM-DD-YYYY', () => {
      const testData = {
        ...mockData.data,
        medicarePartAEffectiveDate: '2023-12-01',
      };
      const form = createForm(testData);
      const result = parseTransformed(form);
      expect(result.medicarePartAEffectiveDate).to.equal('12-01-2023');
    });

    it('should set statementOfTruthSignature from signature field', () => {
      const testData = {
        ...mockData.data,
        signature: 'Certifier Jones',
      };
      const form = createForm(testData);
      const result = parseTransformed(form);
      expect(result.statementOfTruthSignature).to.equal('Certifier Jones');
    });

    it('should build primary contact info with applicant name, certifier email, and applicant phone', () => {
      const testData = {
        ...mockData.data,
        applicantName: { first: 'Jane', last: 'Smith' },
        certifierEmail: 'jane@example.com',
        applicantPhone: '1234567890',
      };
      const form = createForm(testData);
      const result = parseTransformed(form);
      expect(result.primaryContactInfo.name).to.deep.equal({
        first: 'Jane',
        last: 'Smith',
      });
      expect(result.primaryContactInfo.email).to.equal('jane@example.com');
      expect(result.primaryContactInfo.phone).to.equal('1234567890');
    });

    it('should set missing primary contact values to false', () => {
      const testData = {
        certifierRole: 'other',
        applicantName: { first: 'Jane', last: 'Smith' },
      };
      const form = createForm(testData);
      const result = parseTransformed(form);
      expect(result.primaryContactInfo.phone).to.equal(false);
      expect(result.primaryContactInfo.email).to.equal(false);
    });
  });

  context('legacy format (feature flag disabled)', () => {
    it('should keep applicant fields at top level', () => {
      const testData = {
        ...mockData.data,
        applicantName: { first: 'John', last: 'Doe' },
        applicantSsn: '123456789',
      };
      const form = createForm(testData, false);
      const result = parseTransformed(form);
      expect(result.applicants).to.be.undefined;
      expect(result.applicantName).to.deep.equal({
        first: 'John',
        last: 'Doe',
      });
      expect(result.applicantSsn).to.equal('123456789');
    });

    it('should set applicantMedicareAdvantage when class is advantage', () => {
      const testData = {
        ...mockData.data,
        applicantMedicareClass: 'advantage',
      };
      const form = createForm(testData, false);
      const result = parseTransformed(form);
      expect(result.applicantMedicareAdvantage).to.be.true;
    });

    it('should set hasOtherHealthInsurance when applicant has primary or secondary', () => {
      const testDataPrimary = {
        ...mockData.data,
        applicantHasPrimary: true,
        applicantHasSecondary: false,
      };
      const formPrimary = createForm(testDataPrimary, false);
      const resultPrimary = parseTransformed(formPrimary);
      expect(resultPrimary.hasOtherHealthInsurance).to.be.true;

      const testDataBoth = {
        ...mockData.data,
        applicantHasPrimary: true,
        applicantHasSecondary: true,
      };
      const formBoth = createForm(testDataBoth, false);
      const resultBoth = parseTransformed(formBoth);
      expect(resultBoth.hasOtherHealthInsurance).to.be.true;

      const testDataNeither = {
        ...mockData.data,
        applicantHasPrimary: false,
        applicantHasSecondary: false,
      };
      const formNeither = createForm(testDataNeither, false);
      const resultNeither = parseTransformed(formNeither);
      expect(resultNeither.hasOtherHealthInsurance || false).to.be.false;
    });

    it('should concatenate applicant address streets', () => {
      const testData = {
        ...mockData.data,
        applicantAddress: {
          street: '123 Main St',
          street2: 'Apt 4B',
          city: 'Anytown',
          state: 'CA',
          postalCode: '12345',
        },
      };
      const form = createForm(testData, false);
      const result = parseTransformed(form);
      expect(result.applicantAddress.streetCombined).to.exist;
    });

    it('should collect supporting docs from top level', () => {
      const form = createForm(mockData.data, false);
      const result = parseTransformed(form);
      expect(result.supportingDocs).to.be.an('array');
    });
  });

  context('Rev 2025 format (feature flag enabled)', () => {
    it('should extract applicant fields into applicants array', () => {
      const testData = {
        ...mockDataRev2025.data,
        applicantName: { first: 'Jane', last: 'Smith' },
        applicantSsn: '987654321',
        applicantAddress: {
          street: '456 Oak Ave',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
      };
      const form = createForm(testData, true);
      const result = parseTransformed(form);

      expect(result.applicants)
        .to.be.an('array')
        .with.lengthOf(1);
      expect(result.applicants[0].applicantName).to.deep.equal({
        first: 'Jane',
        last: 'Smith',
      });
      expect(result.applicants[0].applicantSsn).to.equal('987654321');
    });

    it('should remove applicant fields from top level', () => {
      const testData = {
        ...mockDataRev2025.data,
        applicantName: { first: 'John', last: 'Doe' },
        applicantSsn: '123456789',
      };
      const form = createForm(testData, true);
      const result = parseTransformed(form);

      expect(result.applicantName).to.be.undefined;
      expect(result.applicantSsn).to.be.undefined;
    });

    it('should extract medicare fields into applicant medicare array', () => {
      const testData = {
        ...mockDataRev2025.data,
        applicantName: { first: 'John', last: 'Doe' },
      };
      const form = createForm(testData, true);
      const result = parseTransformed(form);

      expect(result.applicants[0].medicare)
        .to.be.an('array')
        .with.lengthOf(1);
      expect(result.applicants[0].medicare[0].medicarePlanType).to.equal('c');
      expect(result.applicants[0].medicare[0].medicareNumber).to.equal(
        '1EG4TE5MK73',
      );
    });

    it('should remove medicare fields from top level', () => {
      const testData = {
        ...mockDataRev2025.data,
        applicantName: { first: 'John', last: 'Doe' },
        medicarePlanType: 'c',
        medicareNumber: '1EG4TE5MK73',
      };
      const form = createForm(testData, true);
      const result = parseTransformed(form);

      expect(result.medicarePlanType).to.be.undefined;
      expect(result.medicareNumber).to.be.undefined;
    });

    it('should nest healthInsurance array into applicant', () => {
      const testData = {
        ...mockDataRev2025.data,
        applicantName: { first: 'John', last: 'Doe' },
        healthInsurance: [
          {
            insuranceType: 'medigap',
            provider: 'Blue Cross',
            effectiveDate: '2024-01-01',
          },
        ],
      };
      const form = createForm(testData, true);
      const result = parseTransformed(form);

      expect(result.applicants[0].healthInsurance)
        .to.be.an('array')
        .with.lengthOf(1);
      expect(result.applicants[0].healthInsurance[0].insuranceType).to.equal(
        'medigap',
      );
      expect(result.applicants[0].healthInsurance[0].provider).to.equal(
        'Blue Cross',
      );
    });

    it('should remove healthInsurance array from top level', () => {
      const testData = {
        ...mockDataRev2025.data,
        applicantName: { first: 'John', last: 'Doe' },
        healthInsurance: [{ insuranceType: 'medigap' }],
      };
      const form = createForm(testData, true);
      const result = parseTransformed(form);

      expect(result.healthInsurance).to.be.undefined;
    });

    it('should concatenate applicant address streets within applicants array', () => {
      const testData = {
        ...mockDataRev2025.data,
        applicantAddress: {
          street: '123 Main St',
          street2: 'Apt 4B',
          city: 'Anytown',
          state: 'CA',
          postalCode: '12345',
        },
      };
      const form = createForm(testData, true);
      const result = parseTransformed(form);

      expect(result.applicants[0].applicantAddress.streetCombined).to.exist;
    });

    it('should collect supporting docs from applicant medicare and healthInsurance', () => {
      const testData = {
        ...mockDataRev2025.data,
        applicantName: { first: 'John', last: 'Doe' },
        healthInsurance: [
          {
            insuranceCardFront: {
              name: 'front.png',
              confirmationCode: 'abc123',
            },
          },
        ],
      };
      const form = createForm(testData, true);
      const result = parseTransformed(form);

      expect(result.supportingDocs).to.be.an('array');
    });

    it('should clean supporting docs from medicare array after collecting', () => {
      const testData = {
        ...mockDataRev2025.data,
        applicantName: { first: 'John', last: 'Doe' },
        medicareNumber: '1EG4TE5MK73',
        medicareCardFront: {
          name: 'medicare_front.png',
          confirmationCode: 'xyz789',
        },
      };
      const form = createForm(testData, true);
      const result = parseTransformed(form);

      expect(result.supportingDocs).to.be.an('array');

      if (result.applicants[0].medicare) {
        expect(result.applicants[0].medicare[0].medicareCardFront).to.be
          .undefined;
      }
    });

    it('should clean supporting docs from healthInsurance array after collecting', () => {
      const testData = {
        ...mockDataRev2025.data,
        applicantName: { first: 'John', last: 'Doe' },
        healthInsurance: [
          {
            provider: 'Blue Cross',
            insuranceCardFront: {
              name: 'insurance_front.png',
              confirmationCode: 'def456',
            },
          },
        ],
      };
      const form = createForm(testData, true);
      const result = parseTransformed(form);

      expect(result.supportingDocs).to.be.an('array');
      expect(result.applicants[0].healthInsurance[0].insuranceCardFront).to.be
        .undefined;
    });

    it('should handle empty healthInsurance array', () => {
      const testData = {
        ...mockDataRev2025.data,
        applicantName: { first: 'John', last: 'Doe' },
        healthInsurance: [],
      };
      const form = createForm(testData, true);
      const result = parseTransformed(form);

      expect(result.applicants[0].healthInsurance)
        .to.be.an('array')
        .with.lengthOf(0);
    });

    it('should match expected JSON structure', () => {
      const testData = {
        certifierRole: 'other',
        applicantName: { first: 'Applicant', middle: 'I', last: 'Surname' },
        applicantSsn: '234234234',
        applicantAddress: {
          country: 'USA',
          street: '456 Street Circle',
          city: 'Anyburg',
          state: 'AK',
          postalCode: '12323',
        },
        applicantEmail: 'applicant@email.gov',
        applicantPhone: '3331233456',
        applicantGender: 'male',
        medicarePlanType: 'c',
        medicareNumber: '1EG4TE5MK73',
        medicarePartAEffectiveDate: '2023-01-15',
        medicarePartBEffectiveDate: '2023-01-15',
        medicarePartCCarrier: 'Advantage Health Solutions',
        medicarePartCEffectiveDate: '2023-02-01',
        hasMedicarePartD: true,
        medicarePartDCarrier: 'PharmaCare Plus',
        medicarePartDEffectiveDate: '2023-02-01',
        healthInsurance: [
          {
            insuranceType: 'medigap',
            provider: 'Blue Cross Blue Shield',
            effectiveDate: '2024-10-01',
          },
        ],
        signature: 'Certifier Jones',
      };
      const form = createForm(testData, true);
      const result = parseTransformed(form);

      expect(result.formNumber).to.equal('10-7959C');
      expect(result.certifierRole).to.equal('other');
      expect(result.applicants)
        .to.be.an('array')
        .with.lengthOf(1);
      expect(result.applicants[0]).to.have.property('applicantName');
      expect(result.applicants[0]).to.have.property('applicantSsn');
      expect(result.applicants[0]).to.have.property('applicantAddress');
      expect(result.applicants[0]).to.have.property('medicare');
      expect(result.applicants[0]).to.have.property('healthInsurance');
      expect(result).to.have.property('supportingDocs');
      expect(result).to.have.property('primaryContactInfo');
      expect(result).to.have.property('certificationDate');
      expect(result).to.have.property('statementOfTruthSignature');
    });
  });
});
