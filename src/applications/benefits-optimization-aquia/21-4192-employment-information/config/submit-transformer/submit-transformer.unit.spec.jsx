/**
 * @module tests/config/submit-transformer.unit.spec
 * @description Unit tests for submit transformer
 */

import { expect } from 'chai';
import { transformForSubmit } from './submit-transformer';

describe('Submit Transformer', () => {
  const mockFormConfig = {};

  describe('Basic Functionality', () => {
    it('should export a function', () => {
      expect(transformForSubmit).to.be.a('function');
    });

    it('should accept formConfig and form parameters', () => {
      const result = transformForSubmit(mockFormConfig, { data: {} });
      expect(result).to.be.a('string');
    });

    it('should return JSON string', () => {
      const result = transformForSubmit(mockFormConfig, { data: {} });
      expect(() => JSON.parse(result)).to.not.throw();
    });
  });

  describe('Veteran Information Transformation', () => {
    it('should transform veteran full name', () => {
      const form = {
        data: {
          veteranInformation: {
            veteranFullName: {
              first: 'John',
              middle: 'Michael',
              last: 'Doe',
            },
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.veteranInformation.fullName.first).to.equal('John');
      expect(result.veteranInformation.fullName.middle).to.equal('Michael');
      expect(result.veteranInformation.fullName.last).to.equal('Doe');
    });

    it('should handle missing middle name', () => {
      const form = {
        data: {
          veteranInformation: {
            veteranFullName: {
              first: 'Jane',
              last: 'Smith',
            },
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.veteranInformation.fullName.first).to.equal('Jane');
      expect(result.veteranInformation.fullName.middle).to.equal('');
      expect(result.veteranInformation.fullName.last).to.equal('Smith');
    });

    it('should transform date of birth to YYYY-MM-DD format', () => {
      const form = {
        data: {
          veteranInformation: {
            dateOfBirth: '1985-03-22',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.veteranInformation.dateOfBirth).to.equal('1985-03-22');
    });

    it('should handle date with zero-padding', () => {
      const form = {
        data: {
          veteranInformation: {
            dateOfBirth: '1985-3-5',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.veteranInformation.dateOfBirth).to.equal('1985-03-05');
    });

    it('should remove SSN dashes', () => {
      const form = {
        data: {
          veteranContactInformation: {
            ssn: '123-45-6789',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.veteranInformation.ssn).to.equal('123456789');
    });

    it('should handle SSN without dashes', () => {
      const form = {
        data: {
          veteranContactInformation: {
            ssn: '123456789',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.veteranInformation.ssn).to.equal('123456789');
    });

    it('should transform VA file number', () => {
      const form = {
        data: {
          veteranContactInformation: {
            vaFileNumber: '987654321',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.veteranInformation.vaFileNumber).to.equal('987654321');
    });

    it('should set address to null', () => {
      const form = {
        data: {
          veteranInformation: {},
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      // address is set to null but removed by removeNullUndefined
      expect(result.veteranInformation.address).to.not.exist;
    });
  });

  describe('Employment Information Transformation', () => {
    it('should transform employer name', () => {
      const form = {
        data: {
          employerInformation: {
            employerName: 'Acme Corporation',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.employmentInformation.employerName).to.equal(
        'Acme Corporation',
      );
    });

    it('should transform employer address with country code', () => {
      const form = {
        data: {
          employerInformation: {
            employerAddress: {
              street: '123 Main St',
              street2: 'Suite 100',
              city: 'Springfield',
              state: 'IL',
              postalCode: '62701',
              country: 'US',
            },
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.employmentInformation.employerAddress.street).to.equal(
        '123 Main St',
      );
      expect(result.employmentInformation.employerAddress.street2).to.equal(
        'Suite 100',
      );
      expect(result.employmentInformation.employerAddress.city).to.equal(
        'Springfield',
      );
      expect(result.employmentInformation.employerAddress.state).to.equal('IL');
      expect(result.employmentInformation.employerAddress.postalCode).to.equal(
        '62701',
      );
      expect(result.employmentInformation.employerAddress.country).to.equal(
        'US',
      );
    });

    it('should default country to US if missing', () => {
      const form = {
        data: {
          employerInformation: {
            employerAddress: {
              street: '123 Main St',
              city: 'Springfield',
              state: 'IL',
              postalCode: '62701',
            },
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.employmentInformation.employerAddress.country).to.equal(
        'US',
      );
    });

    it('should transform employment dates', () => {
      const form = {
        data: {
          employmentDates: {
            beginningDate: '2020-01-15',
            endingDate: '2023-06-30',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.employmentInformation.beginningDateOfEmployment).to.equal(
        '2020-01-15',
      );
      expect(result.employmentInformation.endingDateOfEmployment).to.equal(
        '2023-06-30',
      );
    });

    it('should omit ending date when not provided (currently employed)', () => {
      const form = {
        data: {
          employmentDates: {
            beginningDate: '2020-01-15',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      // null values are removed by removeNullUndefined function
      expect(result.employmentInformation.endingDateOfEmployment).to.not.exist;
    });

    it('should transform currency values', () => {
      const form = {
        data: {
          employmentEarningsHours: {
            amountEarned: '$45,678.90',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(
        result.employmentInformation.amountEarnedLast12MonthsOfEmployment,
      ).to.equal(45678.9);
    });

    it('should handle numeric currency values', () => {
      const form = {
        data: {
          employmentEarningsHours: {
            amountEarned: 50000,
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(
        result.employmentInformation.amountEarnedLast12MonthsOfEmployment,
      ).to.equal(50000);
    });

    it('should transform hours values', () => {
      const form = {
        data: {
          employmentEarningsHours: {
            dailyHours: '8.5',
            weeklyHours: '40',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.employmentInformation.hoursWorkedDaily).to.equal(8.5);
      expect(result.employmentInformation.hoursWorkedWeekly).to.equal(40);
    });

    it('should transform employment concessions', () => {
      const form = {
        data: {
          employmentConcessions: {
            concessions: 'Some concessions info',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.employmentInformation.concessions).to.equal(
        'Some concessions info',
      );
    });

    it('should transform termination information', () => {
      const form = {
        data: {
          employmentTermination: {
            terminationReason: 'resigned',
            dateLastWorked: '2023-06-30',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.employmentInformation.terminationReason).to.equal(
        'resigned',
      );
      expect(result.employmentInformation.dateLastWorked).to.equal(
        '2023-06-30',
      );
    });

    it('should transform last payment information', () => {
      const form = {
        data: {
          employmentLastPayment: {
            dateOfLastPayment: '2023-06-30',
            grossAmountLastPayment: '$5,000',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.employmentInformation.lastPaymentDate).to.equal(
        '2023-06-30',
      );
      expect(result.employmentInformation.lastPaymentGrossAmount).to.equal(
        5000,
      );
    });

    it('should handle lump sum payment data', () => {
      const form = {
        data: {
          employmentLastPayment: {
            lumpSumPayment: 'yes',
            grossAmountPaid: '$10,000',
            datePaid: '2023-07-15',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.employmentInformation.lumpSumPaymentMade).to.be.true;
      expect(result.employmentInformation.grossAmountPaid).to.equal(10000);
      expect(result.employmentInformation.datePaid).to.equal('2023-07-15');
    });

    it('should not include lump sum data if not applicable', () => {
      const form = {
        data: {
          employmentLastPayment: {
            lumpSumPayment: 'no',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.employmentInformation.lumpSumPaymentMade).to.be.false;
      // null values are removed by removeNullUndefined function
      expect(result.employmentInformation.grossAmountPaid).to.not.exist;
      expect(result.employmentInformation.datePaid).to.not.exist;
    });

    it('should handle employer address as null when not provided', () => {
      const form = {
        data: {
          employerInformation: {},
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      // null values are removed by removeNullUndefined function
      expect(result.employmentInformation.employerAddress).to.not.exist;
    });
  });

  describe('Military Duty Status Transformation', () => {
    it('should include military duty status when reserveOrGuardStatus is yes', () => {
      const form = {
        data: {
          dutyStatus: {
            reserveOrGuardStatus: 'yes',
          },
          dutyStatusDetails: {
            currentDutyStatus: 'Active',
            disabilitiesPreventDuties: 'yes',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.militaryDutyStatus).to.exist;
      expect(result.militaryDutyStatus.currentDutyStatus).to.equal('Active');
      expect(result.militaryDutyStatus.veteranDisabilitiesPreventMilitaryDuties)
        .to.be.true;
    });

    it('should include military duty status when reserveOrGuardStatus is true', () => {
      const form = {
        data: {
          dutyStatus: {
            reserveOrGuardStatus: true,
          },
          dutyStatusDetails: {
            currentDutyStatus: 'Reserve',
            disabilitiesPreventDuties: false,
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.militaryDutyStatus).to.exist;
      expect(result.militaryDutyStatus.currentDutyStatus).to.equal('Reserve');
      expect(result.militaryDutyStatus.veteranDisabilitiesPreventMilitaryDuties)
        .to.be.false;
    });

    it('should convert yes/no to boolean for disabilities prevent duties', () => {
      const form = {
        data: {
          dutyStatus: {
            reserveOrGuardStatus: 'yes',
          },
          dutyStatusDetails: {
            currentDutyStatus: 'Reserve',
            disabilitiesPreventDuties: 'no',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.militaryDutyStatus.veteranDisabilitiesPreventMilitaryDuties)
        .to.be.false;
    });

    it('should not include military duty status when reserveOrGuardStatus is no', () => {
      const form = {
        data: {
          dutyStatus: {
            reserveOrGuardStatus: 'no',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.militaryDutyStatus).to.not.exist;
    });

    it('should not include military duty status when reserveOrGuardStatus is false', () => {
      const form = {
        data: {
          dutyStatus: {
            reserveOrGuardStatus: false,
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.militaryDutyStatus).to.not.exist;
    });

    it('should omit military duty status when not provided', () => {
      const form = {
        data: {},
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.militaryDutyStatus).to.not.exist;
    });
  });

  describe('Benefit Entitlement and Payments Transformation', () => {
    it('should transform benefit entitlement information', () => {
      const form = {
        data: {
          benefitsInformation: {
            benefitEntitlement: 'yes',
          },
          benefitsDetails: {
            benefitType: 'retirement',
            grossMonthlyAmount: '$2,500',
            startReceivingDate: '2020-01-01',
            firstPaymentDate: '2020-01-15',
            stopReceivingDate: '2025-01-01',
          },
          remarks: {
            remarks: 'Some remarks about benefits',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.benefitEntitlementPayments.sickRetirementOtherBenefits).to
        .be.true;
      expect(result.benefitEntitlementPayments.typeOfBenefit).to.equal(
        'retirement',
      );
      expect(
        result.benefitEntitlementPayments.grossMonthlyAmountOfBenefit,
      ).to.equal(2500);
      expect(result.benefitEntitlementPayments.dateBenefitBegan).to.equal(
        '2020-01-01',
      );
      expect(result.benefitEntitlementPayments.dateFirstPaymentIssued).to.equal(
        '2020-01-15',
      );
      expect(result.benefitEntitlementPayments.dateBenefitWillStop).to.equal(
        '2025-01-01',
      );
      expect(result.benefitEntitlementPayments.remarks).to.equal(
        'Some remarks about benefits',
      );
    });

    it('should include benefitEntitlementPayments section with false value when benefitEntitlement is no', () => {
      const form = {
        data: {
          benefitsInformation: {
            benefitEntitlement: 'no',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      // Section should include false value so backend can fill "NO" in the PDF
      expect(result.benefitEntitlementPayments).to.exist;
      expect(result.benefitEntitlementPayments.sickRetirementOtherBenefits).to
        .be.false;
    });

    it('should include benefitEntitlementPayments section with false value when benefitEntitlement is false', () => {
      const form = {
        data: {
          benefitsInformation: {
            benefitEntitlement: false,
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      // Section should include false value when using boolean false
      expect(result.benefitEntitlementPayments).to.exist;
      expect(result.benefitEntitlementPayments.sickRetirementOtherBenefits).to
        .be.false;
    });

    it('should include remarks when benefitEntitlement is no', () => {
      const form = {
        data: {
          benefitsInformation: {
            benefitEntitlement: 'no',
          },
          remarks: {
            remarks: 'Additional information here',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.benefitEntitlementPayments).to.exist;
      expect(result.benefitEntitlementPayments.sickRetirementOtherBenefits).to
        .be.false;
      expect(result.benefitEntitlementPayments.remarks).to.equal(
        'Additional information here',
      );
    });

    it('should include benefitEntitlementPayments when benefitEntitlement is true', () => {
      const form = {
        data: {
          benefitsInformation: {
            benefitEntitlement: true,
          },
          benefitsDetails: {
            benefitType: 'sick leave',
            grossMonthlyAmount: 1500,
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.benefitEntitlementPayments).to.exist;
      expect(result.benefitEntitlementPayments.sickRetirementOtherBenefits).to
        .be.true;
      expect(result.benefitEntitlementPayments.typeOfBenefit).to.equal(
        'sick leave',
      );
    });
  });

  describe('Null and Undefined Handling', () => {
    it('should remove null values from output', () => {
      const form = {
        data: {
          veteranInformation: {
            veteranFullName: {
              first: 'John',
              middle: null,
              last: 'Doe',
            },
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.veteranInformation.fullName.middle).to.equal('');
    });

    it('should handle completely empty form data', () => {
      const form = {
        data: {},
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result).to.be.an('object');
      expect(result.veteranInformation).to.exist;
      expect(result.employmentInformation).to.exist;
    });

    it('should handle form data with all missing sections', () => {
      const form = {
        data: {
          veteranInformation: {},
          veteranContactInformation: {},
          employerInformation: {},
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      // null values are removed by removeNullUndefined function
      expect(result.veteranInformation.ssn).to.not.exist;
      expect(result.employmentInformation.employerName).to.equal('');
    });
  });

  describe('Complete Form Submission', () => {
    it('should handle full form submission with all sections', () => {
      const form = {
        data: {
          veteranInformation: {
            veteranFullName: {
              first: 'John',
              middle: 'Q',
              last: 'Veteran',
            },
            dateOfBirth: '1980-05-15',
          },
          veteranContactInformation: {
            ssn: '123-45-6789',
            vaFileNumber: '12345678',
          },
          employerInformation: {
            employerName: 'Tech Corp',
            employerAddress: {
              street: '456 Tech Blvd',
              city: 'San Francisco',
              state: 'CA',
              postalCode: '94105',
              country: 'US',
            },
          },
          employmentDates: {
            beginningDate: '2015-01-01',
            endingDate: '2023-12-31',
          },
          employmentEarningsHours: {
            typeOfWork: 'Software Engineer',
            amountEarned: '$120,000',
            dailyHours: '8',
            weeklyHours: '40',
          },
          dutyStatus: {
            reserveOrGuardStatus: 'no',
          },
          benefitsInformation: {
            benefitEntitlement: 'no',
          },
          remarks: {
            remarks: 'No additional remarks',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      // Verify structure
      expect(result.veteranInformation).to.exist;
      expect(result.employmentInformation).to.exist;
      expect(result.certification).to.exist;

      // Verify militaryDutyStatus does not exist when not reserve/guard
      expect(result.militaryDutyStatus).to.not.exist;

      // Verify benefitEntitlementPayments includes false value when benefitEntitlement is 'no'
      expect(result.benefitEntitlementPayments).to.exist;
      expect(result.benefitEntitlementPayments.sickRetirementOtherBenefits).to
        .be.false;

      // Verify key transformations
      expect(result.veteranInformation.fullName.first).to.equal('John');
      expect(result.veteranInformation.ssn).to.equal('123456789');
      expect(result.employmentInformation.employerName).to.equal('Tech Corp');
      expect(
        result.employmentInformation.amountEarnedLast12MonthsOfEmployment,
      ).to.equal(120000);

      // Verify certification defaults when not provided
      expect(result.certification.signature).to.be.undefined;
      expect(result.certification.certified).to.be.false;
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle very large currency amounts', () => {
      const form = {
        data: {
          employmentEarningsHours: {
            amountEarned: '$999,999,999.99',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(
        result.employmentInformation.amountEarnedLast12MonthsOfEmployment,
      ).to.equal(999999999.99);
    });

    it('should handle zero currency values', () => {
      const form = {
        data: {
          employmentEarningsHours: {
            amountEarned: '0',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(
        result.employmentInformation.amountEarnedLast12MonthsOfEmployment,
      ).to.equal(0);
    });

    it('should handle decimal hours values', () => {
      const form = {
        data: {
          employmentEarningsHours: {
            dailyHours: '7.5',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.employmentInformation.hoursWorkedDaily).to.equal(7.5);
    });

    it('should handle empty string values', () => {
      const form = {
        data: {
          employerInformation: {
            employerName: '',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.employmentInformation.employerName).to.equal('');
    });
  });

  describe('Data Type Conversions', () => {
    it('should convert yes/no strings to booleans correctly', () => {
      const form = {
        data: {
          dutyStatus: {
            reserveOrGuardStatus: 'yes',
          },
          dutyStatusDetails: {
            currentDutyStatus: 'Active',
            disabilitiesPreventDuties: 'yes',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.militaryDutyStatus).to.exist;
      expect(
        typeof result.militaryDutyStatus
          .veteranDisabilitiesPreventMilitaryDuties,
      ).to.equal('boolean');
    });

    it('should handle invalid date formatting gracefully', () => {
      const form = {
        data: {
          veteranInformation: {
            dateOfBirth: 'invalid-date',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      // null values are removed by removeNullUndefined function
      expect(result.veteranInformation.dateOfBirth).to.not.exist;
    });

    it('should handle invalid currency formatting gracefully', () => {
      const form = {
        data: {
          employmentEarningsHours: {
            amountEarned: 'not-a-number',
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      // null values are removed by removeNullUndefined function
      expect(result.employmentInformation.amountEarnedLast12MonthsOfEmployment)
        .to.not.exist;
    });
  });

  describe('Certification Transformation', () => {
    it('should use provided statementOfTruth signature', () => {
      const form = {
        data: {
          veteranInformation: {
            veteranFullName: {
              first: 'Jane',
              last: 'Doe',
            },
          },
          statementOfTruthSignature: 'J. Doe',
          statementOfTruthCertified: true,
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.certification).to.exist;
      expect(result.certification.signature).to.equal('J. Doe');
      expect(result.certification.certified).to.be.true;
    });

    it('should have undefined signature when not provided', () => {
      const form = {
        data: {
          veteranInformation: {
            veteranFullName: {
              first: 'John',
              middle: 'M',
              last: 'Smith',
            },
          },
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.certification).to.exist;
      expect(result.certification.signature).to.be.undefined;
      expect(result.certification.certified).to.be.false;
    });

    it('should respect certified false when explicitly provided', () => {
      const form = {
        data: {
          veteranInformation: {
            veteranFullName: {
              first: 'Bob',
              last: 'Jones',
            },
          },
          statementOfTruthSignature: 'Bob Jones',
          statementOfTruthCertified: false,
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.certification).to.exist;
      expect(result.certification.certified).to.be.false;
    });

    it('should always include certification section', () => {
      const form = {
        data: {},
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      // Certification should always exist even with empty form data
      expect(result.certification).to.exist;
      expect(result.certification.certified).to.be.false;
    });

    it('should handle platform statementOfTruth signature pattern', () => {
      const form = {
        data: {
          statementOfTruthSignature: 'Platform Signature',
          statementOfTruthCertified: true,
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.certification).to.exist;
      expect(result.certification.signature).to.equal('Platform Signature');
      expect(result.certification.certified).to.be.true;
    });

    it('should handle platform statementOfTruthCertified false', () => {
      const form = {
        data: {
          statementOfTruthSignature: 'Test User',
          statementOfTruthCertified: false,
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.certification).to.exist;
      expect(result.certification.certified).to.be.false;
    });

    it('should use statementOfTruthSignature field', () => {
      const form = {
        data: {
          statementOfTruthSignature: 'Platform Pattern',
          statementOfTruthCertified: true,
        },
      };

      const result = JSON.parse(transformForSubmit(mockFormConfig, form));

      expect(result.certification).to.exist;
      expect(result.certification.signature).to.equal('Platform Pattern');
      expect(result.certification.certified).to.be.true;
    });
  });
});
