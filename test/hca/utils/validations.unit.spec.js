import { expect } from 'chai';

import _ from 'lodash';

import { isValidSpouseInformation } from '../../../src/js/hca/utils/validations.js';

describe('Validations unit tests', () => {
  describe('isValidSpouseInformation', () => {
    const spouseTestData = {
      maritalStatus: {
        value: 'foo'
      },
      spouseAddress: {
        country: { value: 'USA' },
        state: { value: 'AL' },
        zipcode: { value: '12345' },
        street: { value: 'foo' },
        city: { value: 'foo' }
      },
      spousePhone: {
        value: '1115551234'
      },
      sameAddress: {
        value: 'N'
      },
      discloseFinancialInformation: {
        value: 'Y'
      }
    };

    context('with a valid address', () => {
      it('should return true', () => {
        expect(isValidSpouseInformation(spouseTestData)).to.be.true;
      });
    });

    context('with an invalid address', () => {
      let spouseTestDataInvalidAddress;

      before(() => {
        spouseTestDataInvalidAddress = _.cloneDeep(spouseTestData);
        spouseTestDataInvalidAddress.spouseAddress.zipcode.value = '';
      });

      it('should return false', () => {
        expect(isValidSpouseInformation(spouseTestDataInvalidAddress)).to.be.false;
      });
    });
  });
});
