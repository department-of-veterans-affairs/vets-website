import { expect } from 'chai';
import {
  addressUI,
  addressSchema,
  applyKeyMapping,
  updateFormDataAddress,
} from '../../../src/js/web-component-patterns/addressPattern';

describe('addressPattern mapping functions', () => {
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

  describe('applyKeyMapping utility', () => {
    it('should map field keys correctly', () => {
      const originalSchema = {
        street: { type: 'string', title: 'Street' },
        postalCode: { type: 'string', title: 'Postal code' },
        city: { type: 'string', title: 'City' },
      };

      const newSchemaKeys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const result = applyKeyMapping(originalSchema, newSchemaKeys);

      // Should have mapped keys
      expect(result).to.have.property('addressLine1');
      expect(result).to.have.property('zipCode');
      expect(result).to.have.property('city'); // Unmapped field preserved

      // Should not have original mapped keys
      expect(result).to.not.have.property('street');
      expect(result).to.not.have.property('postalCode');

      // Should preserve field configurations
      expect(result.addressLine1).to.deep.equal({
        type: 'string',
        title: 'Street',
      });
      expect(result.zipCode).to.deep.equal({
        type: 'string',
        title: 'Postal code',
      });
    });

    it('should handle omit with standard field names', () => {
      const originalSchema = {
        street: { type: 'string' },
        street2: { type: 'string' },
        street3: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const newSchemaKeys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const result = applyKeyMapping(originalSchema, newSchemaKeys, [
        'street2',
        'street3',
      ]);

      // Should have mapped keys
      expect(result).to.have.property('addressLine1');
      expect(result).to.have.property('zipCode');

      // Should not have omitted fields
      expect(result).to.not.have.property('street2');
      expect(result).to.not.have.property('street3');
    });

    it('should handle omit with mapped field names', () => {
      const originalSchema = {
        street: { type: 'string' },
        street2: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const newSchemaKeys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };
      const result = applyKeyMapping(originalSchema, newSchemaKeys, [
        'addressLine1',
        'zipCode',
      ]);

      // Should omit by mapped names
      expect(result).to.not.have.property('addressLine1');
      expect(result).to.not.have.property('street');
      expect(result).to.not.have.property('zipCode');
      expect(result).to.not.have.property('postalCode');

      // Should keep non-omitted, non-mapped field
      expect(result).to.have.property('street2');
    });

    it('should return original schema when no mapping provided', () => {
      const originalSchema = {
        street: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const result = applyKeyMapping(originalSchema, {});

      expect(result).to.deep.equal(originalSchema);
    });
    it('should return original schema when newSchemaKeys is empty', () => {
      const originalSchema = {
        street: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const result = applyKeyMapping(originalSchema, {}, []);

      expect(result).to.deep.equal(originalSchema);
    });

    it('should handle undefined parameters gracefully', () => {
      const originalSchema = {
        street: { type: 'string' },
      };

      const result = applyKeyMapping(originalSchema);

      expect(result).to.deep.equal(originalSchema);
    });

    it('should handle omit list with both source and target names', () => {
      const originalSchema = {
        street: { type: 'string' },
        street2: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const newSchemaKeys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const result = applyKeyMapping(originalSchema, newSchemaKeys, [
        'street', // Omit by source name
        'zipCode', // Omit by target name
        'street2', // Omit unmapped field
      ]);

      // All should be omitted
      expect(result).to.not.have.property('street');
      expect(result).to.not.have.property('addressLine1');
      expect(result).to.not.have.property('street2');
      expect(result).to.not.have.property('postalCode');
      expect(result).to.not.have.property('zipCode');

      // Result should be empty object
      expect(Object.keys(result)).to.have.length(0);
    });
  });
  describe('key collision detection', () => {
    it('should throw error when mapping to existing field name', () => {
      const originalSchema = {
        street: { type: 'string', title: 'Street' },
        addressLine1: { type: 'string', title: 'Address Line 1' },
        postalCode: { type: 'string', title: 'Postal Code' },
      };

      const newSchemaKeys = {
        street: 'addressLine1', // Collision: addressLine1 already exists
      };

      expect(() => applyKeyMapping(originalSchema, newSchemaKeys)).to.throw(
        /Field mapping would cause key collisions.*'street' -> 'addressLine1'/,
      );
    });

    it('should throw error for multiple key collisions', () => {
      const originalSchema = {
        street: { type: 'string' },
        street2: { type: 'string' },
        addressLine1: { type: 'string' },
        zipCode: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const newSchemaKeys = {
        street: 'addressLine1', // Collision
        postalCode: 'zipCode', // Collision
      };

      expect(() => applyKeyMapping(originalSchema, newSchemaKeys)).to.throw(
        /Field mapping would cause key collisions.*'street' -> 'addressLine1'.*'postalCode' -> 'zipCode'/,
      );
    });
    it('should allow mapping field to itself (no collision)', () => {
      const originalSchema = {
        street: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const newSchemaKeys = {
        street: 'street', // Same name, should be fine
      };

      expect(() =>
        applyKeyMapping(originalSchema, newSchemaKeys),
      ).to.not.throw();
    });

    it('should detect collision with case sensitivity', () => {
      const originalSchema = {
        street: { type: 'string' },
        Street: { type: 'string' }, // Different case
      };

      const newSchemaKeys = {
        street: 'Street', // Collision due to case
      };

      expect(() => applyKeyMapping(originalSchema, newSchemaKeys)).to.throw(
        /Field mapping would cause key collisions.*'street' -> 'Street'/,
      );
    });
    it('should work when target field does not exist in original schema', () => {
      const originalSchema = {
        street: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const newSchemaKeys = {
        street: 'addressLine1', // addressLine1 doesn't exist in original
        postalCode: 'zipCode', // zipCode doesn't exist in original
      };
      const result = applyKeyMapping(originalSchema, newSchemaKeys);

      expect(result).to.have.property('addressLine1');
      expect(result).to.have.property('zipCode');
      expect(result).to.not.have.property('street');
      expect(result).to.not.have.property('postalCode');
    });

    it('should detect collision even when target field would be omitted', () => {
      const originalSchema = {
        street: { type: 'string' },
        addressLine1: { type: 'string' },
      };

      const newSchemaKeys = {
        street: 'addressLine1',
      };

      // Even though addressLine1 would be omitted, the collision should be detected first
      expect(() =>
        applyKeyMapping(originalSchema, newSchemaKeys, ['addressLine1']),
      ).to.throw(/Field mapping would cause key collisions/);
    });

    it('should handle complex collision scenarios with multiple mappings', () => {
      const originalSchema = {
        fieldA: { type: 'string' },
        fieldB: { type: 'string' },
        fieldC: { type: 'string' },
        targetX: { type: 'string' },
        targetY: { type: 'string' },
      };

      const newSchemaKeys = {
        fieldA: 'targetX', // Collision
        fieldB: 'targetY', // Collision
        fieldC: 'newField', // No collision
      };

      expect(() => applyKeyMapping(originalSchema, newSchemaKeys)).to.throw(
        /Field mapping would cause key collisions.*'fieldA' -> 'targetX'.*'fieldB' -> 'targetY'/,
      );
    });
  });
  describe('integration with collision detection', () => {
    it('should prevent addressUI from creating schemas with collisions', () => {
      const newSchemaKeys = {
        street: 'country', // This would collide with existing country field
      };

      expect(() => addressUI({ newSchemaKeys })).to.throw(
        /Field mapping would cause key collisions.*'street' -> 'country'/,
      );
    });

    it('should prevent addressSchema from creating schemas with collisions', () => {
      const newSchemaKeys = {
        postalCode: 'city', // This would collide with existing city field
      };

      expect(() => addressSchema({ newSchemaKeys })).to.throw(
        /Field mapping would cause key collisions.*'postalCode' -> 'city'/,
      );
    });

    it('should allow safe mappings that do not cause collisions', () => {
      const newSchemaKeys = {
        street: 'addressLine1',
        street2: 'addressLine2',
        postalCode: 'zipCode',
      };

      // These should work fine as they don't collide with existing fields
      expect(() => addressUI({ newSchemaKeys })).to.not.throw();
      expect(() => addressSchema({ newSchemaKeys })).to.not.throw();
    });
  });
});
