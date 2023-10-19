import { expect } from 'chai';
import sinon from 'sinon';
import { validateZipCode } from '../../config/address-schema';

const DOMESTIC_BASE_ERROR =
  'This postal code is within the U.S. If your mailing address is in the U.S., uncheck the checkbox “I receive mail outside of the United States on a U.S. military base”. If your mailing address is an AFO/FPO/DPO address, enter the postal code for the military base.';
const INVALID_ZIP_ERROR =
  'Because your address is outside the United States on a military base, please provide an APO/FPO/DPO postal code.';

describe('Zip Code Validation', () => {
  it('Invalid Zip Code Tests', () => {
    const TEST_MATRIX = [
      {
        stateCode: 'AP',
        zipCode: '19709',
      },
      {
        stateCode: 'AE',
        zipCode: '19709',
      },
      {
        stateCode: 'AA',
        zipCode: '19709',
      },
    ];
    TEST_MATRIX.forEach(test => {
      const errors = { addError: sinon.spy() };
      expect(validateZipCode(test.zipCode, test.stateCode, errors)).to.be.true;
      expect(errors.addError.calledWithMatch(INVALID_ZIP_ERROR)).to.be.true;
    });
  });

  it('Valid Zip Code Tests', () => {
    const TEST_MATRIX = [
      {
        stateCode: 'AP',
        zipCode: '96201',
      },
      {
        stateCode: 'AE',
        zipCode: '09021',
      },
      {
        stateCode: 'AA',
        zipCode: '34011',
      },
    ];
    TEST_MATRIX.forEach(test => {
      const errors = { addError: sinon.spy() };
      expect(validateZipCode(test.zipCode, test.stateCode, errors)).to.be.true;
      expect(errors.addError.called).to.be.false;
    });
  });

  it('Domestic ZipCode, No State', () => {
    const TEST_MATRIX = [
      {
        stateCode: '',
        zipCode: '19709',
      },
    ];
    TEST_MATRIX.forEach(test => {
      const errors = { addError: sinon.spy() };
      expect(
        validateZipCode(test.zipCode, test.stateCode, errors),
        `${test.zipCode} and ${test.stateCode} were false`,
      ).to.be.true;
      expect(
        errors.addError.calledWithMatch(DOMESTIC_BASE_ERROR),
        `expected error ${DOMESTIC_BASE_ERROR} 
        for Zip Code ${test.zipCode} and State ${test.stateCode}`,
      ).to.be.true;
    });
  });

  it('PO ZipCode, No State', () => {
    const TEST_MATRIX = [
      {
        stateCode: '',
        zipCode: '96201',
      },
      {
        stateCode: '',
        zipCode: '09021',
      },
      {
        stateCode: '',
        zipCode: '34011',
      },
    ];
    TEST_MATRIX.forEach(test => {
      const errors = { addError: sinon.spy() };
      expect(
        validateZipCode(test.zipCode, test.stateCode, errors),
        `${test.zipCode} and ${test.stateCode} were false`,
      ).to.be.true;
      expect(errors.addError.called, `did not expect an error`).to.be.false;
    });
  });
});
