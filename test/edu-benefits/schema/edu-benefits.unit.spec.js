import { expect } from 'chai';
import schema from '../../../src/js/edu-benefits/schema/edu-benefits';
import Ajv from 'ajv';

describe('education benefits json schema', () => {
  let ajv;
  const validateSchema = (data) => {
    return ajv.validate('edu-benefits-schema', data);
  };
  const expectValidData = (data) => {
    expect(validateSchema(data)).to.equal(true);
  };
  const expectInvalidData = (data) => {
    expect(validateSchema(data)).to.equal(false);
    expect(ajv.errors[0].dataPath).to.contain(`.${Object.keys(data)[0]}`);
  };

  before(() => {
    ajv = new Ajv();
    ajv.addSchema(schema, 'edu-benefits-schema');
  });

  context('ssn validations', () => {
    it('should allow an ssn with no dashes', () => {
      expectValidData({ socialSecurityNumber: '123456789' });
    });

    it('should not allow ssn with dashes', () => {
      expectInvalidData({ socialSecurityNumber: '123-45-6789' });
    });

    it('should not allow bad ssn', () => {
      expectInvalidData({ socialSecurityNumber: '12345678' });
    });
  });

  context('name validations', () => {
    const createNameData = (nameFields, parentKey) => {
      const nameData = {
        fullName: nameFields
      };

      if (parentKey == null) {
        return nameData;
      } else {
        return {
          [parentKey]: nameData
        }
      }
    };

    [null, 'emergencyContact'].forEach((parentKey) => {
      it('should allow a valid name', () => {
        expectValidData(createNameData({
          first: 'john',
          last: 'doe'
        }, parentKey));
      });

      it('shouldnt allow an invalid name', () => {
        expectInvalidData(createNameData({
          first: 'john'
        }, parentKey));
      });
    });
  });

  context('gender validations', () => {
    it('should allow a valid gender', () => {
      ['M', 'F'].forEach((gender) => {
        expectValidData({ gender: gender });
      });
    });

    it('shouldnt allow invalid gender', () => {
      expectInvalidData({ gender: 'Z' });
    })
  });

  context('address validations', () => {
    it('should allow a valid address', () => {
      expectValidData({
        address: {
          street: '123 a rd',
          city: 'abc',
          country: 'USA'
        }
      });
    });

    it('shouldnt allow an invalid address', () => {
      expectInvalidData({
        address: {
          city: 'foo',
          country: 'USA'
        }
      });
    });
  });

  context('phone # validations', () => {
    ['phone', 'secondaryPhone'].forEach((field) => {
      context(`phone number in ${field} field`, () => {
        it('should allow valid phone #', () => {
          expectValidData({
            [field]: '5555555555'
          });
        });

        it('shouldnt allow invalid phone #', () => {
          expectInvalidData({
            [field]: '1a'
          });
        });
      });
    });
  });
});
