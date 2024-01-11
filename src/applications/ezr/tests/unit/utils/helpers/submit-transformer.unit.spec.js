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
          medicareClaimNumber: '7AD5WC9MW60',
          medicarePartAEffectiveDate: '2009-01-02',
          'view:isMedicaidEligible': {
            isMedicaidEligible: true,
          },
          'view:isEnrolledMedicarePartA': {
            isEnrolledMedicarePartA: true,
          },
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
          'view:maritalStatus': {
            maritalStatus: 'never married',
          },
          privacyAgreementAccepted: true,
          'view:householdEnabled': true,
          'view:userDob': '1990-01-01',
          'view:userGender': 'F',
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
          medicareClaimNumber: '7AD5WC9MW60',
          medicarePartAEffectiveDate: '2009-01-02',
          isMedicaidEligible: true,
          isEnrolledMedicarePartA: true,
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
          maritalStatus: 'never married',
          privacyAgreementAccepted: true,
          veteranDateOfBirth: '1990-01-01',
          gender: 'F',
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

  context('when loaded data is missing date of birth', () => {
    it('should successfully transform data', () => {
      const form = {
        loadedData: {
          formData: {
            veteranFullName: {
              first: 'Jane',
              last: 'Doe',
            },
            veteranSocialSecurityNumber: '234243444',
            veteranDateOfBirth: null,
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
          'view:isMedicaidEligible': {
            isMedicaidEligible: false,
          },
          'view:isEnrolledMedicarePartA': {
            isEnrolledMedicarePartA: false,
          },
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
          'view:maritalStatus': {
            maritalStatus: 'never married',
          },
          privacyAgreementAccepted: true,
          'view:householdEnabled': true,
          'view:userDob': '',
          'view:userGender': 'F',
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
          maritalStatus: 'never married',
          privacyAgreementAccepted: true,
          gender: 'F',
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

  context('when loaded data is missing birth sex', () => {
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
            gender: null,
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
          'view:isMedicaidEligible': {
            isMedicaidEligible: false,
          },
          'view:isEnrolledMedicarePartA': {
            isEnrolledMedicarePartA: false,
          },
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
          'view:maritalStatus': {
            maritalStatus: 'never married',
          },
          privacyAgreementAccepted: true,
          'view:householdEnabled': true,
          'view:userDob': '1990-01-01',
          'view:userGender': '',
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
          maritalStatus: 'never married',
          privacyAgreementAccepted: true,
          veteranDateOfBirth: '1990-01-01',
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
          'view:isMedicaidEligible': {
            isMedicaidEligible: false,
          },
          'view:isEnrolledMedicarePartA': {
            isEnrolledMedicarePartA: false,
          },
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
          'view:maritalStatus': {
            maritalStatus: 'never married',
          },
          privacyAgreementAccepted: true,
          'view:householdEnabled': true,
          'view:userDob': '1990-01-01',
          'view:userGender': 'F',
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
          maritalStatus: 'never married',
          privacyAgreementAccepted: true,
          veteranDateOfBirth: '1990-01-01',
          gender: 'F',
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
          'view:isMedicaidEligible': {
            isMedicaidEligible: false,
          },
          'view:isEnrolledMedicarePartA': {
            isEnrolledMedicarePartA: false,
          },
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
          'view:maritalStatus': {
            maritalStatus: 'never married',
          },
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
          'view:householdEnabled': true,
          'view:userDob': '1990-01-01',
          'view:userGender': 'F',
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
          maritalStatus: 'never married',
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
          veteranDateOfBirth: '1990-01-01',
          gender: 'F',
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
