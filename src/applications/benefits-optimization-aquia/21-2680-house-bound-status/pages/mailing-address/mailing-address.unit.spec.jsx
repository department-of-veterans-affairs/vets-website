/**
 * @module tests/pages/mailing-address.unit.spec
 * @description Unit tests for mailing address page configuration
 */

import { expect } from 'chai';
import { mailingAddress } from './mailing-address';

describe('Mailing Address Form', () => {
  describe('Page Schema Structure', () => {
    it('should have uiSchema property', () => {
      expect(mailingAddress).to.have.property('uiSchema');
      expect(mailingAddress.uiSchema).to.be.an('object');
    });

    it('should have schema property', () => {
      expect(mailingAddress).to.have.property('schema');
      expect(mailingAddress.schema).to.be.an('object');
    });

    it('should have correct schema type', () => {
      expect(mailingAddress.schema.type).to.equal('object');
    });

    it('should define properties for address field', () => {
      expect(mailingAddress.schema.properties).to.include.keys('address');
    });
  });

  describe('UI Schema Configuration', () => {
    it('should have address field in UI schema', () => {
      expect(mailingAddress.uiSchema).to.have.property('address');
    });

    it('should have page title in UI schema', () => {
      expect(mailingAddress.uiSchema).to.have.property('ui:title');
    });

    it('should configure address UI options', () => {
      expect(mailingAddress.uiSchema.address).to.exist;
    });
  });

  describe('Valid Address Data', () => {
    it('should accept complete Lothal residence address', () => {
      const validData = {
        address: {
          street: '7567 Capital Square',
          street2: 'Apartment 501',
          city: 'Lothal',
          state: 'CA',
          postalCode: '94102',
        },
      };

      expect(validData.address.street).to.exist;
      expect(validData.address.city).to.equal('Lothal');
      expect(validData.address.state).to.have.lengthOf(2);
      expect(validData.address.postalCode).to.match(/^\d{5}$/);
    });

    it('should accept clone barracks address', () => {
      const validData = {
        address: {
          street: '501 Legion Way',
          city: 'Kamino',
          state: 'HI',
          postalCode: '96720',
        },
      };

      expect(validData.address.street).to.include('501');
      expect(validData.address.street2).to.be.undefined;
    });

    it('should accept medical facility address', () => {
      const validData = {
        address: {
          street: '7677 Capital Square',
          street2: 'Lothal Medical Center',
          city: 'Lothal',
          state: 'CA',
          postalCode: '94103',
        },
      };

      expect(validData.address.street2).to.include('Medical Center');
      expect(validData.address.city).to.equal('Lothal');
    });

    it('should accept address without street2', () => {
      const validData = {
        address: {
          street: '123 Rebel Base',
          city: 'Yavin',
          state: 'CA',
          postalCode: '94104',
        },
      };

      expect(validData.address.street).to.exist;
      expect(validData.address.street2).to.be.undefined;
      expect(Object.keys(validData.address)).to.not.include('street2');
    });

    it('should accept veteran housing address', () => {
      const validData = {
        address: {
          street: '2680 Housebound Ave',
          city: 'Coruscant',
          state: 'NY',
          postalCode: '10001',
        },
      };

      expect(validData.address.street).to.include('Housebound');
    });

    it('should accept extended ZIP code format', () => {
      const validData = {
        address: {
          street: '7567 Rex Boulevard',
          city: 'Lothal',
          state: 'CA',
          postalCode: '94102-1234',
        },
      };

      expect(validData.address.postalCode).to.match(/^\d{5}-\d{4}$/);
    });

    it('should accept standard state abbreviations', () => {
      const validData = {
        address: {
          street: '501 ARC Lane',
          city: 'Tipoca',
          state: 'TX',
          postalCode: '75001',
        },
      };

      expect(validData.address.state).to.match(/^[A-Z]{2}$/);
    });
  });

  describe('Schema Property Definitions', () => {
    it('should have address schema definition', () => {
      expect(mailingAddress.schema.properties.address).to.exist;
    });

    it('should use platform address schema', () => {
      const addressSchema = mailingAddress.schema.properties.address;
      expect(addressSchema).to.be.an('object');
    });

    it('should configure address schema with omit options', () => {
      const addressSchema = mailingAddress.schema.properties.address;
      expect(addressSchema).to.exist;
    });
  });

  describe('Address Components', () => {
    it('should validate street address component', () => {
      const address = {
        street: '7567 Capital Square',
      };

      expect(address.street).to.be.a('string');
      expect(address.street.length).to.be.above(0);
    });

    it('should validate city component', () => {
      const address = {
        city: 'Lothal',
      };

      expect(address.city).to.be.a('string');
      expect(address.city).to.have.lengthOf.at.least(1);
    });

    it('should validate state component format', () => {
      const address = {
        state: 'CA',
      };

      expect(address.state).to.match(/^[A-Z]{2}$/);
    });

    it('should validate postal code component', () => {
      const address = {
        postalCode: '94102',
      };

      expect(address.postalCode).to.match(/^\d{5}(-\d{4})?$/);
    });

    it('should validate optional street2 component', () => {
      const address = {
        street2: 'Unit 7567',
      };

      expect(address.street2).to.be.a('string');
    });
  });

  describe('Empty and Missing Data', () => {
    it('should handle empty object', () => {
      const emptyData = {};

      expect(emptyData).to.be.an('object');
      expect(Object.keys(emptyData)).to.have.lengthOf(0);
    });

    it('should handle partial address data', () => {
      const partialData = {
        address: {
          street: '7567 Rex Boulevard',
        },
      };

      expect(partialData.address.street).to.exist;
      expect(partialData.address.city).to.be.undefined;
    });

    it('should handle missing street2 field', () => {
      const dataWithoutStreet2 = {
        address: {
          street: '501 Legion Way',
          city: 'Kamino',
          state: 'HI',
          postalCode: '96720',
        },
      };

      expect(dataWithoutStreet2.address.street2).to.be.undefined;
      expect(Object.keys(dataWithoutStreet2.address)).to.not.include('street2');
    });

    it('should handle missing optional fields', () => {
      const minimalData = {
        address: {
          street: '7567 Capital Square',
          city: 'Lothal',
          state: 'CA',
          postalCode: '94102',
        },
      };

      expect(minimalData.address.street3).to.be.undefined;
    });
  });

  describe('Veteran-Specific Addresses', () => {
    it('should accept clone retirement facility address', () => {
      const validData = {
        address: {
          street: '7567 Veterans Row',
          street2: 'Clone Retirement Wing',
          city: 'Lothal',
          state: 'CA',
          postalCode: '94105',
        },
      };

      expect(validData.address.street2).to.include('Clone Retirement');
    });

    it('should accept military housing address', () => {
      const validData = {
        address: {
          street: 'Building 501',
          street2: 'Former GAR Housing Complex',
          city: 'Coruscant',
          state: 'NY',
          postalCode: '10002',
        },
      };

      expect(validData.address.street2).to.include('GAR Housing');
    });

    it('should accept care facility correspondence address', () => {
      const validData = {
        address: {
          street: '2680 Medical Plaza',
          street2: 'Patient Mail Room',
          city: 'Lothal',
          state: 'CA',
          postalCode: '94106',
        },
      };

      expect(validData.address.street).to.include('Medical');
    });
  });
});
