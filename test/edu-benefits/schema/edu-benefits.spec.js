import { expect } from 'chai';
import schema from '../../../src/js/edu-benefits/schema/edu-benefits';
import Ajv from 'ajv';

describe('education benefits json schema', () => {
  let ajv;
  let validateSchema = (data) => {
    return ajv.validate('edu-benefits-schema', data);
  };
  let expectValidData = (data) => {
    expect(validateSchema(data)).to.be.true;
  };

  before(() => {
    ajv = new Ajv();
    ajv.addSchema(schema, 'edu-benefits-schema');
  });

  context('ssn validations', () => {
    it('should allow an ssn with no dashes', () => {
      expectValidData({ socialSecurityNumber: "123456789" });
    });
  });
});
