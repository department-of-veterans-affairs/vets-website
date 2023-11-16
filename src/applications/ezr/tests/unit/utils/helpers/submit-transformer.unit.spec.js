import { expect } from 'chai';
import { submitTransformer } from '../../../../utils/helpers/submit-transformer';
import formConfig from '../../../../config/form';

describe('ezr submit transformer', () => {
  context('when all required data is provided', () => {
    it('should successfully transform data', () => {
      const form = {
        loadedData: {
          formData: {
            veteranFullName: {
              first: 'Jane',
              last: 'Doe',
            },
            veteranSocialSecurityNumber: '234243444',
            veteranDateOfBirth: '1990-01-01',
            gender: 'F',
          },
        },
        data: {
          veteranFullName: {
            first: 'Jane',
            last: 'Doe',
          },
          veteranSocialSecurityNumber: '234243444',
          veteranDateOfBirth: '1990-01-01',
          gender: 'F',
          isMedicaidEligible: false,
          isEnrolledMedicarePartA: false,
          'view:deductibleMedicalExpenses': {
            deductibleMedicalExpenses: 234,
          },
          'view:deductibleFuneralExpenses': {
            deductibleFuneralExpenses: 11,
          },
          'view:deductibleEducationExpenses': {
            deductibleEducationExpenses: 0,
          },
          'view:veteranGrossIncome': {
            veteranGrossIncome: 234234,
          },
          'view:veteranNetIncome': {
            veteranNetIncome: 234234,
          },
          'view:veteranOtherIncome': {
            veteranOtherIncome: 0,
          },
          'view:addInsurancePolicy': false,
          'view:reportDependents': false,
          veteranAddress: {
            country: 'USA',
            street: '123 elm st',
            city: 'Northampton',
            state: 'MA',
            postalCode: '01060',
          },
          'view:doesMailingMatchHomeAddress': true,
          maritalStatus: 'Never Married',
          privacyAgreementAccepted: true,
        },
      };
      const expectedResult = JSON.stringify({
        asyncCompatible: true,
        form: JSON.stringify({
          veteranFullName: {
            first: 'Jane',
            last: 'Doe',
          },
          veteranSocialSecurityNumber: '234243444',
          veteranDateOfBirth: '1990-01-01',
          gender: 'F',
          isMedicaidEligible: false,
          isEnrolledMedicarePartA: false,
          deductibleMedicalExpenses: 234,
          deductibleFuneralExpenses: 11,
          deductibleEducationExpenses: 0,
          veteranGrossIncome: 234234,
          veteranNetIncome: 234234,
          veteranOtherIncome: 0,
          veteranAddress: {
            country: 'USA',
            street: '123 elm st',
            city: 'Northampton',
            state: 'MA',
            postalCode: '01060',
          },
          maritalStatus: 'Never Married',
          privacyAgreementAccepted: true,
          veteranHomeAddress: {
            country: 'USA',
            street: '123 elm st',
            city: 'Northampton',
            state: 'MA',
            postalCode: '01060',
          },
          dependents: [],
        }),
      });
      expect(submitTransformer(formConfig, form)).to.deep.equal(expectedResult);
    });
  });

  context('when Veteran mailing and home addresses do not match', () => {
    it('should successfully transform data', () => {
      const form = {
        loadedData: {
          formData: {
            veteranFullName: {
              first: 'Jane',
              last: 'Doe',
            },
            veteranSocialSecurityNumber: '234243444',
            veteranDateOfBirth: '1990-01-01',
            gender: 'F',
          },
        },
        data: {
          veteranFullName: {
            first: 'Jane',
            last: 'Doe',
          },
          veteranSocialSecurityNumber: '234243444',
          veteranDateOfBirth: '1990-01-01',
          gender: 'F',
          isMedicaidEligible: false,
          isEnrolledMedicarePartA: false,
          'view:deductibleMedicalExpenses': {
            deductibleMedicalExpenses: 234,
          },
          'view:deductibleFuneralExpenses': {
            deductibleFuneralExpenses: 11,
          },
          'view:deductibleEducationExpenses': {
            deductibleEducationExpenses: 0,
          },
          'view:veteranGrossIncome': {
            veteranGrossIncome: 234234,
          },
          'view:veteranNetIncome': {
            veteranNetIncome: 234234,
          },
          'view:veteranOtherIncome': {
            veteranOtherIncome: 0,
          },
          'view:addInsurancePolicy': false,
          'view:reportDependents': false,
          veteranAddress: {
            country: 'USA',
            street: '123 elm st',
            city: 'Northampton',
            state: 'MA',
            postalCode: '01060',
          },
          veteranHomeAddress: {
            country: 'USA',
            street: '123 elm st',
            city: 'Indianapolis',
            state: 'IN',
            postalCode: '46220',
          },
          'view:doesMailingMatchHomeAddress': false,
          maritalStatus: 'Never Married',
          privacyAgreementAccepted: true,
        },
      };
      const expectedResult = JSON.stringify({
        asyncCompatible: true,
        form: JSON.stringify({
          veteranFullName: {
            first: 'Jane',
            last: 'Doe',
          },
          veteranSocialSecurityNumber: '234243444',
          veteranDateOfBirth: '1990-01-01',
          gender: 'F',
          isMedicaidEligible: false,
          isEnrolledMedicarePartA: false,
          deductibleMedicalExpenses: 234,
          deductibleFuneralExpenses: 11,
          deductibleEducationExpenses: 0,
          veteranGrossIncome: 234234,
          veteranNetIncome: 234234,
          veteranOtherIncome: 0,
          veteranAddress: {
            country: 'USA',
            street: '123 elm st',
            city: 'Northampton',
            state: 'MA',
            postalCode: '01060',
          },
          veteranHomeAddress: {
            country: 'USA',
            street: '123 elm st',
            city: 'Indianapolis',
            state: 'IN',
            postalCode: '46220',
          },
          maritalStatus: 'Never Married',
          privacyAgreementAccepted: true,
          dependents: [],
        }),
      });
      expect(submitTransformer(formConfig, form)).to.deep.equal(expectedResult);
    });
  });

  context('when Dependents have been declared', () => {
    it('should successfully transform data', () => {
      const form = {
        loadedData: {
          formData: {
            veteranFullName: {
              first: 'Jane',
              last: 'Doe',
            },
            veteranSocialSecurityNumber: '234243444',
            veteranDateOfBirth: '1990-01-01',
            gender: 'F',
          },
        },
        data: {
          veteranFullName: {
            first: 'Jane',
            last: 'Doe',
          },
          veteranSocialSecurityNumber: '234243444',
          veteranDateOfBirth: '1990-01-01',
          gender: 'F',
          isMedicaidEligible: false,
          isEnrolledMedicarePartA: false,
          'view:deductibleMedicalExpenses': {
            deductibleMedicalExpenses: 234,
          },
          'view:deductibleFuneralExpenses': {
            deductibleFuneralExpenses: 11,
          },
          'view:deductibleEducationExpenses': {
            deductibleEducationExpenses: 0,
          },
          'view:veteranGrossIncome': {
            veteranGrossIncome: 234234,
          },
          'view:veteranNetIncome': {
            veteranNetIncome: 234234,
          },
          'view:veteranOtherIncome': {
            veteranOtherIncome: 0,
          },
          'view:addInsurancePolicy': false,
          'view:reportDependents': false,
          veteranAddress: {
            country: 'USA',
            street: '123 elm st',
            city: 'Northampton',
            state: 'MA',
            postalCode: '01060',
          },
          'view:doesMailingMatchHomeAddress': true,
          maritalStatus: 'Never Married',
          dependents: [
            {
              fullName: {
                first: 'Ben',
                last: 'Doe',
              },
              dependentRelation: 'Son',
              socialSecurityNumber: '234666654',
              becameDependent: '2004-01-03',
              dateOfBirth: '2004-01-01',
              disabledBefore18: false,
              cohabitedLastYear: true,
              'view:dependentIncome': false,
            },
          ],
          privacyAgreementAccepted: true,
        },
      };
      const expectedResult = JSON.stringify({
        asyncCompatible: true,
        form: JSON.stringify({
          veteranFullName: {
            first: 'Jane',
            last: 'Doe',
          },
          veteranSocialSecurityNumber: '234243444',
          veteranDateOfBirth: '1990-01-01',
          gender: 'F',
          isMedicaidEligible: false,
          isEnrolledMedicarePartA: false,
          deductibleMedicalExpenses: 234,
          deductibleFuneralExpenses: 11,
          deductibleEducationExpenses: 0,
          veteranGrossIncome: 234234,
          veteranNetIncome: 234234,
          veteranOtherIncome: 0,
          veteranAddress: {
            country: 'USA',
            street: '123 elm st',
            city: 'Northampton',
            state: 'MA',
            postalCode: '01060',
          },
          maritalStatus: 'Never Married',
          dependents: [
            {
              fullName: {
                first: 'Ben',
                last: 'Doe',
              },
              dependentRelation: 'Son',
              socialSecurityNumber: '234666654',
              becameDependent: '2004-01-03',
              dateOfBirth: '2004-01-01',
              disabledBefore18: false,
              cohabitedLastYear: true,
              grossIncome: 0,
              netIncome: 0,
              otherIncome: 0,
              dependentEducationExpenses: 0,
            },
          ],
          privacyAgreementAccepted: true,
          veteranHomeAddress: {
            country: 'USA',
            street: '123 elm st',
            city: 'Northampton',
            state: 'MA',
            postalCode: '01060',
          },
        }),
      });
      expect(submitTransformer(formConfig, form)).to.deep.equal(expectedResult);
    });
  });
});
