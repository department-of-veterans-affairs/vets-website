import { expect } from 'chai';
import {
  unwrapSingleItem,
  wrapInSingleArray,
} from '../../../../utils/helpers/array-builder';

const mockState = {
  featureToggles: {
    ezrSpouseConfirmationFlowEnabled: true,
    ezrProvidersAndDependentsPrefillEnabled: true,
  },
};

describe('Array Builder - unwrapSingleItem', () => {
  it('should convert spouse array structure to flat structure', () => {
    const formDataWithArray = {
      otherField: 'preserved',
      spouseInformation: [
        {
          spouseFullName: { first: 'Jane', last: 'Doe' },
          spouseSocialSecurityNumber: '123456789',
          cohabitedLastYear: false,
        },
      ],
    };

    const expectedFlatData = {
      otherField: 'preserved',
      spouseFullName: { first: 'Jane', last: 'Doe' },
      spouseSocialSecurityNumber: '123456789',
      cohabitedLastYear: false,
    };

    const result = unwrapSingleItem(formDataWithArray, mockState);
    expect(result).to.deep.equal(expectedFlatData);
  });

  it('should handle empty form data', () => {
    const result = unwrapSingleItem({});
    expect(result).to.deep.equal({});
  });

  it('should handle form data without configured arrays', () => {
    const formData = {
      someField: 'value',
      anotherField: 'anotherValue',
    };

    const result = unwrapSingleItem(formData, mockState);
    expect(result).to.deep.equal(formData);
  });

  it('should handle empty arrays for configured array paths', () => {
    const formDataWithEmptyArrays = {
      otherField: 'preserved',
      spouseInformation: [],
      financialInformation: [],
      someNormalField: 'value',
    };

    const expectedResult = {
      otherField: 'preserved',
      someNormalField: 'value',
    };

    const result = unwrapSingleItem(formDataWithEmptyArrays, mockState);
    expect(result).to.deep.equal(expectedResult);

    // Explicitly verify the empty arrays are removed.
    expect(result).to.not.have.property('spouseInformation');
    expect(result).to.not.have.property('financialInformation');
  });

  it('should handle financial information with view fields (from EZR test)', () => {
    const ezrFormData = {
      financialInformation: [
        {
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
            veteranOtherIncome: 3454,
          },
          'view:spouseGrossIncome': {
            spouseGrossIncome: 75454,
          },
          'view:spouseNetIncome': {
            spouseNetIncome: 2656,
          },
          'view:spouseOtherIncome': {
            spouseOtherIncome: 324,
          },
        },
      ],
      veteranFullName: { first: 'Jane', last: 'Doe' },
    };

    const result = unwrapSingleItem(ezrFormData, mockState);

    // Should extract the actual values from nested view fields
    expect(result.deductibleMedicalExpenses).to.equal(234);
    expect(result.deductibleFuneralExpenses).to.equal(11);
    expect(result.deductibleEducationExpenses).to.equal(0);
    expect(result.veteranGrossIncome).to.equal(234234);
    expect(result.veteranNetIncome).to.equal(234234);
    expect(result.veteranOtherIncome).to.equal(3454);
    expect(result.spouseGrossIncome).to.equal(75454);
    expect(result.spouseNetIncome).to.equal(2656);
    expect(result.spouseOtherIncome).to.equal(324);

    // Should preserve other fields
    expect(result.veteranFullName).to.deep.equal({
      first: 'Jane',
      last: 'Doe',
    });
  });

  it('should handle simple flat fields in financial array', () => {
    const simpleFinancialData = {
      financialInformation: [
        {
          veteranGrossIncome: 50000,
          veteranNetIncome: 40000,
          deductibleMedicalExpenses: 2000,
        },
      ],
    };

    const result = unwrapSingleItem(simpleFinancialData, mockState);

    expect(result.veteranGrossIncome).to.equal(50000);
    expect(result.veteranNetIncome).to.equal(40000);
    expect(result.deductibleMedicalExpenses).to.equal(2000);
  });
});

describe('Array Builder - wrapInSingleArray', () => {
  it('should convert flat spouse structure to array structure', () => {
    const formDataWithFlat = {
      otherField: 'preserved',
      spouseFullName: { first: 'Jane', last: 'Doe' },
      spouseSocialSecurityNumber: '123456789',
      cohabitedLastYear: false,
    };

    const expectedArrayData = {
      otherField: 'preserved',
      spouseFullName: { first: 'Jane', last: 'Doe' },
      spouseSocialSecurityNumber: '123456789',
      cohabitedLastYear: false,
      spouseInformation: [
        {
          spouseFullName: { first: 'Jane', last: 'Doe' },
          spouseSocialSecurityNumber: '123456789',
          cohabitedLastYear: false,
        },
      ],
    };

    const result = wrapInSingleArray(formDataWithFlat, mockState);
    expect(result).to.deep.equal(expectedArrayData);
  });

  it('should handle financial information conversion', () => {
    const formDataWithFlat = {
      otherField: 'preserved',
      'view:veteranGrossIncome': {
        veteranGrossIncome: 50000,
      },
      'view:veteranNetIncome': {
        veteranNetIncome: 40000,
      },
      'view:spouseGrossIncome': {
        spouseGrossIncome: 30000,
      },
    };

    const expectedArrayData = {
      otherField: 'preserved',
      'view:veteranGrossIncome': {
        veteranGrossIncome: 50000,
      },
      'view:veteranNetIncome': {
        veteranNetIncome: 40000,
      },
      'view:spouseGrossIncome': {
        spouseGrossIncome: 30000,
      },
      financialInformation: [
        {
          'view:veteranGrossIncome': {
            veteranGrossIncome: 50000,
          },
          'view:veteranNetIncome': {
            veteranNetIncome: 40000,
          },
          'view:spouseGrossIncome': {
            spouseGrossIncome: 30000,
          },
        },
      ],
    };

    const result = wrapInSingleArray(formDataWithFlat, mockState);
    expect(result).to.deep.equal(expectedArrayData);
  });

  it('should handle empty form data', () => {
    const result = wrapInSingleArray({}, {});
    expect(result).to.deep.equal({});
  });

  it('should handle form data without configured flat fields', () => {
    const formData = {
      someField: 'value',
      anotherField: 'anotherValue',
    };

    const result = wrapInSingleArray(formData, mockState);
    expect(result).to.deep.equal(formData);
  });
});
