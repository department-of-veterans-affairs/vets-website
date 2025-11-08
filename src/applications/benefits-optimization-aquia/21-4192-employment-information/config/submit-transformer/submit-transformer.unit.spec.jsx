/**
 * @module tests/config/submit-transformer.unit.spec
 * @description Unit tests for submit transformer
 */

import { expect } from 'chai';
import { transformForSubmit } from './submit-transformer';

describe('transformForSubmit', () => {
  const mockFormConfig = {};

  describe('Veteran Information Transformation', () => {
    it('should transform veteran name and date of birth', () => {
      const form = {
        data: {
          veteranInformation: {
            firstName: 'John',
            middleName: 'A',
            lastName: 'Doe',
            dateOfBirth: '1980-01-15',
          },
          veteranContactInformation: {
            ssn: '123-45-6789',
            vaFileNumber: '987654321',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(result.veteranInformation).to.deep.equal({
        fullName: {
          first: 'John',
          middle: 'A',
          last: 'Doe',
        },
        ssn: '123456789', // Dashes removed
        vaFileNumber: '987654321',
        dateOfBirth: '1980-01-15',
        address: null,
      });
    });

    it('should handle missing middle name', () => {
      const form = {
        data: {
          veteranInformation: {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1980-01-15',
          },
          veteranContactInformation: {
            ssn: '123456789',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(result.veteranInformation.fullName).to.deep.equal({
        first: 'John',
        middle: '',
        last: 'Doe',
      });
    });

    it('should handle missing VA file number', () => {
      const form = {
        data: {
          veteranInformation: {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1980-01-15',
          },
          veteranContactInformation: {
            ssn: '123456789',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(result.veteranInformation.vaFileNumber).to.be.null;
    });
  });

  describe('Employment Information Transformation', () => {
    it('should transform complete employment information', () => {
      const form = {
        data: {
          employerInformation: {
            employerName: 'Acme Corp',
            employerAddress: {
              street: '123 Main St',
              street2: 'Suite 100',
              city: 'Springfield',
              state: 'IL',
              postalCode: '62701',
              country: 'USA',
            },
          },
          employmentDates: {
            beginningDate: '2020-01-01',
            endingDate: '2023-12-31',
            currentlyEmployed: false,
          },
          employmentEarningsHours: {
            typeOfWork: 'Software Engineer',
            amountEarned: '$50,000.00',
            timeLost: '2 weeks',
            dailyHours: '8',
            weeklyHours: '40',
          },
          employmentConcessions: {
            concessions: 'Flexible schedule',
          },
          employmentTermination: {
            terminationReason: 'Medical reasons',
            dateLastWorked: '2023-12-15',
          },
          employmentLastPayment: {
            dateOfLastPayment: '2023-12-31',
            grossAmountLastPayment: '$4,500.00',
            lumpSumPayment: 'yes',
            grossAmountPaid: '$10,000.00',
            datePaid: '2024-01-15',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);
      const employment = result.employmentInformation;

      expect(employment.employerName).to.equal('Acme Corp');
      expect(employment.employerAddress).to.deep.equal({
        street: '123 Main St',
        street2: 'Suite 100',
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        postalCode: '62701',
      });
      expect(employment.typeOfWorkPerformed).to.equal('Software Engineer');
      expect(employment.beginningDateOfEmployment).to.equal('2020-01-01');
      expect(employment.endingDateOfEmployment).to.equal('2023-12-31');
      expect(employment.amountEarnedLast12MonthsOfEmployment).to.equal(50000);
      expect(employment.timeLostLast12MonthsOfEmployment).to.equal('2 weeks');
      expect(employment.hoursWorkedDaily).to.equal(8);
      expect(employment.hoursWorkedWeekly).to.equal(40);
      expect(employment.concessions).to.equal('Flexible schedule');
      expect(employment.terminationReason).to.equal('Medical reasons');
      expect(employment.dateLastWorked).to.equal('2023-12-15');
      expect(employment.lastPaymentDate).to.equal('2023-12-31');
      expect(employment.lastPaymentGrossAmount).to.equal(4500);
      expect(employment.lumpSumPaymentMade).to.be.true;
      expect(employment.grossAmountPaid).to.equal(10000);
      expect(employment.datePaid).to.equal('2024-01-15');
    });

    it('should handle currently employed status', () => {
      const form = {
        data: {
          employerInformation: {
            employerName: 'Acme Corp',
            employerAddress: {
              street: '123 Main St',
              city: 'Springfield',
              state: 'IL',
              postalCode: '62701',
            },
          },
          employmentDates: {
            beginningDate: '2020-01-01',
            currentlyEmployed: true,
          },
          employmentEarningsHours: {
            typeOfWork: 'Software Engineer',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(result.employmentInformation.endingDateOfEmployment).to.be.null;
    });

    it('should handle no lump sum payment', () => {
      const form = {
        data: {
          employerInformation: {
            employerName: 'Acme Corp',
            employerAddress: {
              street: '123 Main St',
              city: 'Springfield',
              state: 'IL',
              postalCode: '62701',
            },
          },
          employmentDates: {
            beginningDate: '2020-01-01',
            currentlyEmployed: true,
          },
          employmentEarningsHours: {
            typeOfWork: 'Software Engineer',
          },
          employmentLastPayment: {
            dateOfLastPayment: '2023-12-31',
            grossAmountLastPayment: '$4,500.00',
            lumpSumPayment: 'no',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);
      const employment = result.employmentInformation;

      expect(employment.lumpSumPaymentMade).to.be.false;
      expect(employment.grossAmountPaid).to.be.null;
      expect(employment.datePaid).to.be.null;
    });

    it('should handle currency formatting', () => {
      const form = {
        data: {
          employerInformation: {
            employerName: 'Test Corp',
            employerAddress: {
              street: '123 Main St',
              city: 'Test City',
              state: 'TS',
              postalCode: '12345',
            },
          },
          employmentDates: {
            beginningDate: '2020-01-01',
            currentlyEmployed: true,
          },
          employmentEarningsHours: {
            typeOfWork: 'Tester',
            amountEarned: '$1,234,567.89',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(
        result.employmentInformation.amountEarnedLast12MonthsOfEmployment,
      ).to.equal(1234567.89);
    });
  });

  describe('Military Duty Status Transformation', () => {
    it('should include duty status when veteran is in Reserve/Guard', () => {
      const form = {
        data: {
          dutyStatus: {
            reserveOrGuardStatus: 'yes',
          },
          dutyStatusDetails: {
            currentDutyStatus: 'Active Reserve',
            disabilitiesPreventDuties: 'no',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(result.militaryDutyStatus).to.deep.equal({
        currentDutyStatus: 'Active Reserve',
        veteranDisabilitiesPreventMilitaryDuties: false,
      });
    });

    it('should exclude duty status section when veteran is not in Reserve/Guard', () => {
      const form = {
        data: {
          dutyStatus: {
            reserveOrGuardStatus: 'no',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(result.militaryDutyStatus).to.be.undefined;
    });

    it('should handle yes/no conversion to boolean', () => {
      const form = {
        data: {
          dutyStatus: {
            reserveOrGuardStatus: 'yes',
          },
          dutyStatusDetails: {
            currentDutyStatus: 'Active Reserve',
            disabilitiesPreventDuties: 'yes',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(result.militaryDutyStatus.veteranDisabilitiesPreventMilitaryDuties)
        .to.be.true;
    });
  });

  describe('Benefit Entitlement Payments Transformation', () => {
    it('should transform complete benefits information', () => {
      const form = {
        data: {
          benefitsInformation: {
            benefitEntitlement: 'yes',
          },
          benefitsDetails: {
            benefitType: 'Sick leave',
            grossMonthlyAmount: '$2,500.00',
            startReceivingDate: '2023-01-01',
            firstPaymentDate: '2023-02-01',
            stopReceivingDate: '2024-12-31',
          },
          remarks: {
            remarks: 'Additional information here',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);
      const benefits = result.benefitEntitlementPayments;

      expect(benefits.sickRetirementOtherBenefits).to.be.true;
      expect(benefits.typeOfBenefit).to.equal('Sick leave');
      expect(benefits.grossMonthlyAmountOfBenefit).to.equal(2500);
      expect(benefits.dateBenefitBegan).to.equal('2023-01-01');
      expect(benefits.dateFirstPaymentIssued).to.equal('2023-02-01');
      expect(benefits.dateBenefitWillStop).to.equal('2024-12-31');
      expect(benefits.remarks).to.equal('Additional information here');
    });

    it('should handle no benefit entitlement', () => {
      const form = {
        data: {
          benefitsInformation: {
            benefitEntitlement: 'no',
          },
          remarks: {
            remarks: 'No benefits received',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);
      const benefits = result.benefitEntitlementPayments;

      expect(benefits.sickRetirementOtherBenefits).to.be.false;
      expect(benefits.typeOfBenefit).to.be.null;
      expect(benefits.grossMonthlyAmountOfBenefit).to.be.null;
      expect(benefits.dateBenefitBegan).to.be.null;
      expect(benefits.dateFirstPaymentIssued).to.be.null;
      expect(benefits.dateBenefitWillStop).to.be.null;
      expect(benefits.remarks).to.equal('No benefits received');
    });
  });

  describe('Complete Form Transformation', () => {
    it('should transform a complete form submission', () => {
      const form = {
        data: {
          veteranInformation: {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1980-01-15',
          },
          veteranContactInformation: {
            ssn: '123-45-6789',
          },
          employerInformation: {
            employerName: 'Test Corp',
            employerAddress: {
              street: '123 Main St',
              city: 'Test City',
              state: 'TS',
              postalCode: '12345',
            },
          },
          employmentDates: {
            beginningDate: '2020-01-01',
            currentlyEmployed: true,
          },
          employmentEarningsHours: {
            typeOfWork: 'Tester',
          },
          dutyStatus: {
            reserveOrGuardStatus: 'no',
          },
          benefitsInformation: {
            benefitEntitlement: 'no',
          },
          remarks: {},
        },
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(result).to.have.property('veteranInformation');
      expect(result).to.have.property('employmentInformation');
      expect(result).to.have.property('benefitEntitlementPayments');
      expect(result).to.have.property('employerCertification');
      expect(result).to.not.have.property('militaryDutyStatus');
    });
  });

  describe('Edge Cases and Null Handling', () => {
    it('should handle empty form data', () => {
      const form = {
        data: {},
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(result).to.exist;
      expect(result.veteranInformation).to.exist;
      expect(result.employmentInformation).to.exist;
    });

    it('should handle null and undefined values gracefully', () => {
      const form = {
        data: {
          veteranInformation: {
            firstName: 'John',
            middleName: null,
            lastName: 'Doe',
          },
          employmentEarningsHours: {
            amountEarned: '',
            timeLost: null,
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(result.veteranInformation.fullName.middle).to.equal('');
      expect(result.employmentInformation.amountEarnedLast12MonthsOfEmployment)
        .to.be.null;
    });

    it('should handle invalid currency formats', () => {
      const form = {
        data: {
          employerInformation: {
            employerName: 'Test',
            employerAddress: {
              street: '123',
              city: 'City',
              state: 'ST',
              postalCode: '12345',
            },
          },
          employmentDates: {
            beginningDate: '2020-01-01',
            currentlyEmployed: true,
          },
          employmentEarningsHours: {
            typeOfWork: 'Test',
            amountEarned: 'invalid',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(result.employmentInformation.amountEarnedLast12MonthsOfEmployment)
        .to.be.null;
    });

    it('should handle invalid date formats', () => {
      const form = {
        data: {
          veteranInformation: {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: 'invalid-date',
          },
          veteranContactInformation: {
            ssn: '123456789',
          },
        },
      };

      const result = transformForSubmit(mockFormConfig, form);

      expect(result.veteranInformation.dateOfBirth).to.equal('invalid-date');
    });
  });
});
