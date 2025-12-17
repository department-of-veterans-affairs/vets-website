import { expect } from 'chai';
import sinon from 'sinon';
import {
  addressUI,
  addressSchema,
  updateFormDataAddress,
} from '../../../src/js/web-component-patterns/addressPattern';

describe('addressPattern mapping functions', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('addressUI', () => {
    it('should return UI schema with mapped field keys', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        postalCode: 'zipCode',
      };

      const result = addressUI({ newSchemaKeys });

      // Should have mapped keys instead of standard keys
      expect(result).to.have.property('addressLine1');
      expect(result).to.have.property('addressLine2');
      expect(result).to.have.property('addressLine3');
      expect(result).to.have.property('zipCode');

      // Should not have original keys
      expect(result).to.not.have.property('street');
      expect(result).to.not.have.property('street2');
      expect(result).to.not.have.property('street3');
      expect(result).to.not.have.property('postalCode');

      // Should still have unmapped keys
      expect(result).to.have.property('isMilitary');
      expect(result).to.have.property('country');
      expect(result).to.have.property('city');
      expect(result).to.have.property('state');
    });

    it('should preserve field configurations when mapping keys', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const result = addressUI({ newSchemaKeys });

      // Check that field configurations are preserved
      expect(result.addressLine1).to.have.property('ui:required');
      expect(result.addressLine1).to.have.property('ui:webComponentField');
      expect(result.addressLine1).to.have.property('ui:errorMessages');

      expect(result.zipCode).to.have.property('ui:required');
      expect(result.zipCode).to.have.property('ui:webComponentField');
      expect(result.zipCode).to.have.property('ui:options');
    });

    it('should handle partial key mapping correctly', () => {
      const newSchemaKeys = {
        postalCode: 'zipCode',
      };

      const result = addressUI({ newSchemaKeys });

      // Should have mapped key
      expect(result).to.have.property('zipCode');
      expect(result).to.not.have.property('postalCode');

      // Should keep unmapped keys with original names
      expect(result).to.have.property('street');
      expect(result).to.have.property('street2');
      expect(result).to.have.property('city');
      expect(result).to.have.property('state');
    });

    it('should respect omit option with standard keys', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
        street2: 'addressLine2',
      };

      const result = addressUI({
        newSchemaKeys,
        omit: ['street3', 'isMilitary'],
      });

      // Should have mapped keys
      expect(result).to.have.property('addressLine1');
      expect(result).to.have.property('addressLine2');

      // Should omit specified fields (using standard keys)
      expect(result).to.not.have.property('street3');
      expect(result).to.not.have.property('addressLine3');
      expect(result).to.not.have.property('isMilitary');
    });

    it('should work with no newSchemaKeys provided', () => {
      const result = addressUI({});

      // Should return standard keys when no mapping provided
      expect(result).to.have.property('street');
      expect(result).to.have.property('street2');
      expect(result).to.have.property('street3');
      expect(result).to.have.property('postalCode');
      expect(result).to.have.property('city');
      expect(result).to.have.property('state');
      expect(result).to.have.property('country');
      expect(result).to.have.property('isMilitary');
    });

    it('should pass through other options to base addressUI', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
      };

      const labels = {
        street: 'Custom Street Label',
        militaryCheckbox: 'Custom Military Label',
      };

      const result = addressUI({ newSchemaKeys, labels });

      // Check that labels are applied correctly
      expect(result.addressLine1['ui:title']).to.equal('Custom Street Label');
      expect(result.isMilitary['ui:title']).to.equal('Custom Military Label');
    });
  });

  describe('addressSchema with key mapping', () => {
    describe('without key mapping (newSchemaKeys empty)', () => {
      it('should return standard schema when no newSchemaKeys provided', () => {
        const result = addressSchema();

        expect(result).to.have.property('type', 'object');
        expect(result).to.have.property('properties');
        expect(result.properties).to.have.property('street');
        expect(result.properties).to.have.property('street2');
        expect(result.properties).to.have.property('street3');
        expect(result.properties).to.have.property('postalCode');
        expect(result.properties).to.have.property('city');
        expect(result.properties).to.have.property('state');
        expect(result.properties).to.have.property('country');
        expect(result.properties).to.have.property('isMilitary');
      });
      it('should omit specified fields when omit array provided and no newSchemaKeys', () => {
        const result = addressSchema({ omit: ['street2', 'street3'] });

        // Should have standard fields except omitted ones
        expect(result.properties).to.have.property('street');
        expect(result.properties).to.have.property('postalCode');
        expect(result.properties).to.have.property('city');
        expect(result.properties).to.have.property('state');
        expect(result.properties).to.have.property('country');
        expect(result.properties).to.have.property('isMilitary');

        // Should not have omitted fields
        expect(result.properties).to.not.have.property('street2');
        expect(result.properties).to.not.have.property('street3');
      });

      it('should return all fields when empty omit array provided', () => {
        const result = addressSchema({ omit: [] });

        expect(result.properties).to.have.property('street');
        expect(result.properties).to.have.property('street2');
        expect(result.properties).to.have.property('street3');
        expect(result.properties).to.have.property('postalCode');
      });
    });

    describe('with key mapping (newSchemaKeys provided)', () => {
      it('should map field keys when newSchemaKeys provided', () => {
        const newSchemaKeys = {
          street: 'addressLine1',
          street2: 'addressLine2',
          street3: 'addressLine3',
          postalCode: 'zipCode',
        };

        const result = addressSchema({ newSchemaKeys });

        // Should have mapped keys
        expect(result.properties).to.have.property('addressLine1');
        expect(result.properties).to.have.property('addressLine2');
        expect(result.properties).to.have.property('addressLine3');
        expect(result.properties).to.have.property('zipCode');

        // Should not have original keys
        expect(result.properties).to.not.have.property('street');
        expect(result.properties).to.not.have.property('street2');
        expect(result.properties).to.not.have.property('street3');
        expect(result.properties).to.not.have.property('postalCode');

        // Should still have unmapped keys
        expect(result.properties).to.have.property('city');
        expect(result.properties).to.have.property('state');
        expect(result.properties).to.have.property('country');
        expect(result.properties).to.have.property('isMilitary');
      });

      it('should preserve property configurations when mapping keys', () => {
        const newSchemaKeys = {
          street: 'addressLine1',
          postalCode: 'zipCode',
        };

        const result = addressSchema({ newSchemaKeys });

        // Check that property definitions are preserved
        expect(result.properties.addressLine1).to.have.property(
          'type',
          'string',
        );
        expect(result.properties.addressLine1).to.have.property('minLength', 1);
        expect(result.properties.addressLine1).to.have.property(
          'maxLength',
          100,
        );

        expect(result.properties.zipCode).to.have.property('type', 'string');
      });

      it('should apply omit filtering with mapped keys', () => {
        const newSchemaKeys = {
          street: 'addressLine1',
          street2: 'addressLine2',
          street3: 'addressLine3',
          postalCode: 'zipCode',
        };

        const result = addressSchema({
          newSchemaKeys,
          omit: ['street3', 'isMilitary'],
        });

        // Should have mapped keys (except omitted ones)
        expect(result.properties).to.have.property('addressLine1');
        expect(result.properties).to.have.property('addressLine2');
        expect(result.properties).to.have.property('zipCode');

        // Should not have omitted fields
        expect(result.properties).to.not.have.property('addressLine3');
        expect(result.properties).to.not.have.property('street3');
        expect(result.properties).to.not.have.property('isMilitary');

        // Should still have other unmapped, non-omitted keys
        expect(result.properties).to.have.property('city');
        expect(result.properties).to.have.property('state');
        expect(result.properties).to.have.property('country');
      });
      it('should omit using mapped key names in omit array', () => {
        const newSchemaKeys = {
          street: 'addressLine1',
          postalCode: 'zipCode',
        };

        const result = addressSchema({
          newSchemaKeys,
          omit: ['addressLine1', 'zipCode'], // Using mapped names in omit
        });

        // Should not have the omitted mapped keys
        expect(result.properties).to.not.have.property('addressLine1');
        expect(result.properties).to.not.have.property('street');
        expect(result.properties).to.not.have.property('zipCode');
        expect(result.properties).to.not.have.property('postalCode');

        // Should still have unmapped, non-omitted keys
        expect(result.properties).to.have.property('street2');
        expect(result.properties).to.have.property('street3');
        expect(result.properties).to.have.property('city');
        expect(result.properties).to.have.property('state');
      });

      it('should handle partial key mapping correctly', () => {
        const newSchemaKeys = {
          postalCode: 'zipCode',
        };

        const result = addressSchema({ newSchemaKeys });

        // Should have mapped key
        expect(result.properties).to.have.property('zipCode');
        expect(result.properties).to.not.have.property('postalCode');
        // Should keep unmapped keys with original names
        expect(result.properties).to.have.property('street');
        expect(result.properties).to.have.property('street2');
        expect(result.properties).to.have.property('street3');
        expect(result.properties).to.have.property('city');
        expect(result.properties).to.have.property('state');
      });
    });

    describe('edge cases', () => {
      it('should handle empty newSchemaKeys object', () => {
        const result = addressSchema({ newSchemaKeys: {} });

        // Should behave like no newSchemaKeys provided
        expect(result.properties).to.have.property('street');
        expect(result.properties).to.have.property('postalCode');
      });

      it('should handle undefined options parameter', () => {
        const result = addressSchema();

        expect(result).to.have.property('type', 'object');
        expect(result).to.have.property('properties');
        expect(result.properties).to.have.property('street');
      });

      it('should handle options with undefined newSchemaKeys', () => {
        const result = addressSchema({ newSchemaKeys: undefined });

        expect(result.properties).to.have.property('street');
        expect(result.properties).to.have.property('postalCode');
      });

      it('should handle mapping keys that do not exist in original schema', () => {
        const newSchemaKeys = {
          street: 'addressLine1',
          nonExistentField: 'mappedNonExistent',
        };

        const result = addressSchema({ newSchemaKeys });

        // Should map existing fields
        expect(result.properties).to.have.property('addressLine1');
        expect(result.properties).to.not.have.property('street');

        // Should ignore mapping for non-existent fields
        expect(result.properties).to.not.have.property('mappedNonExistent');
        expect(result.properties).to.not.have.property('nonExistentField');
      });
    });
    it('should return schema with mapped property keys', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        postalCode: 'zipCode',
      };

      const result = addressSchema({ newSchemaKeys });

      expect(result).to.have.property('type', 'object');
      expect(result).to.have.property('properties');

      // Should have mapped keys
      expect(result.properties).to.have.property('addressLine1');
      expect(result.properties).to.have.property('addressLine2');
      expect(result.properties).to.have.property('addressLine3');
      expect(result.properties).to.have.property('zipCode');

      // Should not have original keys
      expect(result.properties).to.not.have.property('street');
      expect(result.properties).to.not.have.property('street2');
      expect(result.properties).to.not.have.property('street3');
      expect(result.properties).to.not.have.property('postalCode');

      // Should still have unmapped keys
      expect(result.properties).to.have.property('isMilitary');
      expect(result.properties).to.have.property('country');
      expect(result.properties).to.have.property('city');
      expect(result.properties).to.have.property('state');
    });

    it('should preserve property definitions when mapping', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const result = addressSchema({ newSchemaKeys });

      // Check that property definitions are preserved
      expect(result.properties.addressLine1).to.have.property('type', 'string');
      expect(result.properties.zipCode).to.have.property('type', 'string');
    });

    it('should handle omit option correctly', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
        street2: 'addressLine2',
      };

      const result = addressSchema({
        newSchemaKeys,
        omit: ['street3', 'isMilitary'],
      });

      // Should have mapped keys
      expect(result.properties).to.have.property('addressLine1');
      expect(result.properties).to.have.property('addressLine2');

      // Should omit specified fields
      expect(result.properties).to.not.have.property('street3');
      expect(result.properties).to.not.have.property('addressLine3');
      expect(result.properties).to.not.have.property('isMilitary');
    });
  });

  describe('updateFormDataAddress', () => {
    it('should update form data with mapped field keys', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
        street2: 'addressLine2',
        postalCode: 'zipCode',
      };

      const oldFormData = {
        mailingAddress: {
          isMilitary: true,
          addressLine1: '123 Main St',
          city: 'APO',
          state: 'AE',
          zipCode: '09123',
        },
      };

      const formData = {
        mailingAddress: {
          isMilitary: true,
          addressLine1: '456 Oak St', // only changing address
          city: 'APO',
          state: 'AE',
          zipCode: '09123',
        },
      };

      const result = updateFormDataAddress(
        oldFormData,
        formData,
        ['mailingAddress'],
        null,
        newSchemaKeys,
      );

      expect(result).to.deep.equal(formData);
    });

    it('should handle military base checkbox toggle correctly', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
        city: 'cityName',
        state: 'stateCode',
      };

      const oldFormData = {
        address: {
          isMilitary: false,
          addressLine1: '123 Main St',
          cityName: 'New York',
          stateCode: 'NY',
        },
      };

      const formData = {
        address: {
          isMilitary: true,
          addressLine1: '123 Main St',
          cityName: 'New York',
          stateCode: 'NY',
        },
      };

      const result = updateFormDataAddress(
        oldFormData,
        formData,
        ['address'],
        null,
        newSchemaKeys,
      );

      // Should clear city and state when switching to military
      expect(result.address.cityName).to.equal('');
      expect(result.address.stateCode).to.equal('');
    });

    it('should restore saved address when unchecking military base', () => {
      const newSchemaKeys = {
        city: 'cityName',
        state: 'stateCode',
      };

      // First, simulate checking military base (saves current values)
      const initialOldData = {
        address: {
          isMilitary: false,
          cityName: 'New York',
          stateCode: 'NY',
        },
      };

      const militaryData = {
        address: {
          isMilitary: true,
          cityName: 'APO',
          stateCode: 'AE',
        },
      };

      // This should save the original city/state
      updateFormDataAddress(
        initialOldData,
        militaryData,
        ['address'],
        null,
        newSchemaKeys,
      );

      // Now simulate unchecking military base
      const oldFormData = {
        address: {
          isMilitary: true,
          cityName: 'APO',
          stateCode: 'AE',
        },
      };

      const newFormData = {
        address: {
          isMilitary: false,
          cityName: 'APO',
          stateCode: 'AE',
        },
      };

      const result = updateFormDataAddress(
        oldFormData,
        newFormData,
        ['address'],
        null,
        newSchemaKeys,
      );

      // Should restore the previously saved city and state
      expect(result.address.cityName).to.equal('New York');
      expect(result.address.stateCode).to.equal('NY');
    });

    it('should work with no newSchemaKeys provided', () => {
      const oldFormData = {
        address: {
          isMilitary: false,
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
        },
      };

      const formData = {
        address: {
          isMilitary: true,
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
        },
      };

      const result = updateFormDataAddress(
        oldFormData,
        formData,
        ['address'],
        null,
        {},
      );

      // Should work like regular updateFormDataAddress
      expect(result.address.city).to.equal('');
      expect(result.address.state).to.equal('');
    });

    it('should omit fields when both keyMap and omit are provided', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const result = addressUI({
        newSchemaKeys,
        omit: ['street2', 'street3'],
      });

      // Should have mapped keys
      expect(result).to.have.property('addressLine1');
      expect(result).to.have.property('zipCode');

      // Should NOT have omitted fields
      expect(result).to.not.have.property('street2');
      expect(result).to.not.have.property('street3');

      // Should still have other unmapped, non-omitted fields
      expect(result).to.have.property('city');
      expect(result).to.have.property('state');
    });

    it('should omit using mapped field names in omit array', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
      };

      const result = addressUI({
        newSchemaKeys,
        omit: ['addressLine1'], // Omit using the mapped name
      });

      // Should NOT have the mapped field (omitted by mapped name)
      expect(result).to.not.have.property('addressLine1');
      expect(result).to.not.have.property('street');
    });
  });

  describe('integration with existing patterns', () => {
    it('should work seamlessly with existing address validation', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const uiSchema = addressUI({ newSchemaKeys });
      const schema = addressSchema({ newSchemaKeys });

      // Should have mapped keys
      expect(schema.properties).to.have.property('addressLine1');
      expect(schema.properties).to.have.property('zipCode');

      // Should maintain validation patterns
      expect(uiSchema.addressLine1['ui:required']).to.be.a('function');
      expect(uiSchema.zipCode['ui:required']).to.be.a('function');
      expect(uiSchema['ui:validations']).to.be.an('array');
    });

    it('should preserve all address functionality with mapped keys', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        postalCode: 'zipCode',
      };

      const uiSchema = addressUI({ newSchemaKeys });

      // Should have military checkbox functionality
      expect(uiSchema.isMilitary).to.exist;
      expect(uiSchema['view:militaryBaseDescription']).to.exist;

      // Should have dynamic country/state/city functionality
      expect(uiSchema.country['ui:options'].updateSchema).to.be.a('function');
      expect(uiSchema.city['ui:options'].replaceSchema).to.be.a('function');
      expect(uiSchema.state['ui:options'].replaceSchema).to.be.a('function');
      expect(uiSchema.zipCode['ui:options'].replaceSchema).to.be.a('function');
    });
  });
});
