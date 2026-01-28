import { expect } from 'chai';
import sinon from 'sinon';
import {
  addressUI,
  addressSchema,
  applyKeyMapping,
  extendFieldProperties,
  updateFormDataAddress,
  getFieldValue,
} from '../../../src/js/web-component-patterns/addressPattern';

describe('addressPattern mapping functions', () => {
  describe('addressUI', () => {
    it('should return UI schema with mapped field keys', () => {
      const keys = {
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        postalCode: 'zipCode',
      };

      const result = addressUI({ keys });

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
      const keys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const result = addressUI({ keys });

      // Check that field configurations are preserved
      expect(result.addressLine1).to.have.property('ui:required');
      expect(result.addressLine1).to.have.property('ui:webComponentField');
      expect(result.addressLine1).to.have.property('ui:errorMessages');

      expect(result.zipCode).to.have.property('ui:required');
      expect(result.zipCode).to.have.property('ui:webComponentField');
      expect(result.zipCode).to.have.property('ui:options');
    });

    it('should handle partial key mapping correctly', () => {
      const keys = {
        postalCode: 'zipCode',
      };

      const result = addressUI({ keys });

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
      const keys = {
        street: 'addressLine1',
        street2: 'addressLine2',
      };

      const result = addressUI({
        keys,
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

    it('should work with no keys provided', () => {
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

    it('should omit mapped field when standard key is in omit array', () => {
      const keys = {
        street: 'addressLine1',
      };

      const result = addressUI({
        keys,
        omit: ['street'], // Omit using the standard name; mapped field should also be omitted
      });

      // Should NOT have the mapped field (omitted by standard key)
      expect(result).to.not.have.property('addressLine1');
      expect(result).to.not.have.property('street');
    });

    it('should validate if omit the wrong keys', () => {
      const keys = {
        street: 'addressLine1',
      };

      expect(
        () => addressUI({ keys, omit: ['addressLine1'] }), // Omit using mapped name
      ).to.throw(
        /omit: Invalid key mappings: addressLine1. Valid mappable fields are: country, city, state, street, street2, street3, postalCode, isMilitary/,
      );
    });

    it('should pass through other options to base addressUI', () => {
      const keys = {
        street: 'addressLine1',
      };

      const labels = {
        street: 'Custom Street Label',
        militaryCheckbox: 'Custom Military Label',
      };

      const result = addressUI({ keys, labels });

      // Check that labels are applied correctly
      expect(result.addressLine1['ui:title']).to.equal('Custom Street Label');
      expect(result.isMilitary['ui:title']).to.equal('Custom Military Label');
    });
  });

  describe('addressSchema with key mapping', () => {
    describe('without key mapping (keys empty)', () => {
      it('should return standard schema when no keys provided', () => {
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
      it('should omit specified fields when omit array provided and no keys', () => {
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

    describe('with key mapping (keys provided)', () => {
      it('should map field keys when keys provided', () => {
        const keys = {
          street: 'addressLine1',
          street2: 'addressLine2',
          street3: 'addressLine3',
          postalCode: 'zipCode',
        };

        const result = addressSchema({ keys });

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
        const keys = {
          street: 'addressLine1',
          postalCode: 'zipCode',
        };

        const result = addressSchema({ keys });

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
        const keys = {
          street: 'addressLine1',
          street2: 'addressLine2',
          street3: 'addressLine3',
          postalCode: 'zipCode',
        };

        const result = addressSchema({
          keys,
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

      it('should validate if using wrong keys in omit', () => {
        const keys = {
          street: 'addressLine1',
          postalCode: 'zipCode',
        };

        expect(() =>
          addressSchema({
            keys,
            omit: ['addressLine1', 'zipCode'], // Using mapped names in omit
          }),
        ).to.throw(
          /omit: Invalid key mappings: addressLine1, zipCode. Valid mappable fields are: country, city, state, street, street2, street3, postalCode, isMilitary/,
        );
      });

      it('should handle partial key mapping correctly', () => {
        const keys = {
          postalCode: 'zipCode',
        };

        const result = addressSchema({ keys });

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
      it('should handle empty keys object', () => {
        const result = addressSchema({ keys: {} });

        // Should behave like no keys provided
        expect(result.properties).to.have.property('street');
        expect(result.properties).to.have.property('postalCode');
      });

      it('should handle undefined options parameter', () => {
        const result = addressSchema();

        expect(result).to.have.property('type', 'object');
        expect(result).to.have.property('properties');
        expect(result.properties).to.have.property('street');
      });

      it('should handle options with undefined keys', () => {
        const result = addressSchema({ keys: undefined });

        expect(result.properties).to.have.property('street');
        expect(result.properties).to.have.property('postalCode');
      });

      it('should validate keys not in original schema', () => {
        const keys = {
          street: 'addressLine1',
          nonExistentField: 'mappedNonExistent',
        };

        expect(() => addressSchema({ keys })).to.throw(
          /keys: Invalid key mappings: nonExistentField. Valid mappable fields are: country, city, state, street, street2, street3, postalCode, isMilitary./,
        );
      });
    });
  });

  describe('updateFormDataAddress', () => {
    it('should update form data with mapped field keys', () => {
      const keys = {
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
        keys,
      );

      expect(result).to.deep.equal(formData);
    });

    it('should handle military base checkbox toggle correctly', () => {
      const keys = {
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
        keys,
      );

      // Should clear city and state when switching to military
      expect(result.address.cityName).to.equal('');
      expect(result.address.stateCode).to.equal('');
    });

    it('should restore saved address when unchecking military base', () => {
      const keys = {
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
        keys,
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
        keys,
      );

      // Should restore the previously saved city and state
      expect(result.address.cityName).to.equal('New York');
      expect(result.address.stateCode).to.equal('NY');
    });

    it('should work with no keys provided', () => {
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
      const keys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const uiSchema = addressUI({ keys });
      const schema = addressSchema({ keys });

      // Should have mapped keys
      expect(schema.properties).to.have.property('addressLine1');
      expect(schema.properties).to.have.property('zipCode');

      // Should maintain validation patterns
      expect(uiSchema.addressLine1['ui:required']).to.be.a('function');
      expect(uiSchema.zipCode['ui:required']).to.be.a('function');
      expect(uiSchema['ui:validations']).to.be.an('array');
    });

    it('should preserve all address functionality with mapped keys', () => {
      const keys = {
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        postalCode: 'zipCode',
      };

      const uiSchema = addressUI({ keys });

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

      const keys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const result = applyKeyMapping(originalSchema, keys);

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

    it('should apply key mapping to all fields', () => {
      const originalSchema = {
        street: { type: 'string' },
        street2: { type: 'string' },
        street3: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const keys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const result = applyKeyMapping(originalSchema, keys);

      // Should have mapped keys
      expect(result).to.have.property('addressLine1');
      expect(result).to.have.property('zipCode');

      // Should have unmapped fields with original names
      expect(result).to.have.property('street2');
      expect(result).to.have.property('street3');
    });

    it('should map all specified keys correctly', () => {
      const originalSchema = {
        street: { type: 'string' },
        street2: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const keys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };
      const result = applyKeyMapping(originalSchema, keys);

      // Should have mapped keys
      expect(result).to.have.property('addressLine1');
      expect(result).to.not.have.property('street');
      expect(result).to.have.property('zipCode');
      expect(result).to.not.have.property('postalCode');

      // Should keep unmapped field
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
    it('should return original schema when keys is empty', () => {
      const originalSchema = {
        street: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const result = applyKeyMapping(originalSchema, {});

      expect(result).to.deep.equal(originalSchema);
    });

    it('should handle undefined parameters gracefully', () => {
      const originalSchema = {
        street: { type: 'string' },
      };

      const result = applyKeyMapping(originalSchema);

      expect(result).to.deep.equal(originalSchema);
    });
  });
  describe('key collision detection', () => {
    it('should throw error when mapping to existing field name', () => {
      const originalSchema = {
        street: { type: 'string', title: 'Street' },
        addressLine1: { type: 'string', title: 'Address Line 1' },
        postalCode: { type: 'string', title: 'Postal Code' },
      };

      const keys = {
        street: 'addressLine1', // Collision: addressLine1 already exists
      };

      expect(() => applyKeyMapping(originalSchema, keys)).to.throw(
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

      const keys = {
        street: 'addressLine1', // Collision
        postalCode: 'zipCode', // Collision
      };

      expect(() => applyKeyMapping(originalSchema, keys)).to.throw(
        /Field mapping would cause key collisions.*'street' -> 'addressLine1'.*'postalCode' -> 'zipCode'/,
      );
    });
    it('should allow mapping field to itself (no collision)', () => {
      const originalSchema = {
        street: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const keys = {
        street: 'street', // Same name, should be fine
      };

      expect(() => applyKeyMapping(originalSchema, keys)).to.not.throw();
    });

    it('should detect collision with case sensitivity', () => {
      const originalSchema = {
        street: { type: 'string' },
        Street: { type: 'string' }, // Different case
      };

      const keys = {
        street: 'Street', // Collision due to case
      };

      expect(() => applyKeyMapping(originalSchema, keys)).to.throw(
        /Field mapping would cause key collisions.*'street' -> 'Street'/,
      );
    });
    it('should work when target field does not exist in original schema', () => {
      const originalSchema = {
        street: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const keys = {
        street: 'addressLine1', // addressLine1 doesn't exist in original
        postalCode: 'zipCode', // zipCode doesn't exist in original
      };
      const result = applyKeyMapping(originalSchema, keys);

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

      const keys = {
        street: 'addressLine1',
      };

      // Even though addressLine1 would be omitted, the collision should be detected first
      expect(() => applyKeyMapping(originalSchema, keys)).to.throw(
        /Field mapping would cause key collisions/,
      );
    });

    it('should handle complex collision scenarios with multiple mappings', () => {
      const originalSchema = {
        fieldA: { type: 'string' },
        fieldB: { type: 'string' },
        fieldC: { type: 'string' },
        targetX: { type: 'string' },
        targetY: { type: 'string' },
      };

      const keys = {
        fieldA: 'targetX', // Collision
        fieldB: 'targetY', // Collision
        fieldC: 'newField', // No collision
      };

      expect(() => applyKeyMapping(originalSchema, keys)).to.throw(
        /keys: Invalid key mappings: fieldA, fieldB, fieldC. Valid mappable fields are: country, city, state, street, street2, street3, postalCode, isMilitary./,
      );
    });
  });
  describe('integration with collision detection', () => {
    it('should prevent addressUI from creating schemas with collisions', () => {
      const keys = {
        street: 'country', // This would collide with existing country field
      };

      expect(() => addressUI({ keys })).to.throw(
        /Field mapping would cause key collisions.*'street' -> 'country'/,
      );
    });

    it('should prevent addressSchema from creating schemas with collisions', () => {
      const keys = {
        postalCode: 'city', // This would collide with existing city field
      };

      expect(() => addressSchema({ keys })).to.throw(
        /Field mapping would cause key collisions.*'postalCode' -> 'city'/,
      );
    });

    it('should allow safe mappings that do not cause collisions', () => {
      const keys = {
        street: 'addressLine1',
        street2: 'addressLine2',
        postalCode: 'zipCode',
      };

      // These should work fine as they don't collide with existing fields
      expect(() => addressUI({ keys })).to.not.throw();
      expect(() => addressSchema({ keys })).to.not.throw();
    });
  });

  describe('getFieldValue helper', () => {
    it('should return field value without key mapping', () => {
      const addressData = {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
      };

      const result = getFieldValue('street', addressData);

      expect(result).to.equal('123 Main St');
    });

    it('should return field value with key mapping', () => {
      const addressData = {
        addressLine1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
      };

      const keys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const streetResult = getFieldValue('street', addressData, keys);
      const postalResult = getFieldValue('postalCode', addressData, keys);

      expect(streetResult).to.equal('123 Main St');
      expect(postalResult).to.equal('12345');
    });

    it('should handle unmapped fields correctly', () => {
      const addressData = {
        addressLine1: '123 Main St',
        city: 'Anytown',
        zipCode: '12345',
      };

      const keys = {
        street: 'addressLine1',
        postalCode: 'zipCode',
      };

      const cityResult = getFieldValue('city', addressData, keys);

      expect(cityResult).to.equal('Anytown');
    });

    it('should return undefined for missing fields', () => {
      const addressData = {
        street: '123 Main St',
        city: 'Anytown',
      };

      const result = getFieldValue('postalCode', addressData);

      expect(result).to.be.undefined;
    });

    it('should handle null addressData gracefully', () => {
      const result = getFieldValue('street', null);

      expect(result).to.be.undefined;
    });

    it('should handle undefined addressData gracefully', () => {
      const result = getFieldValue('street', undefined);

      expect(result).to.be.undefined;
    });

    it('should handle empty keys object', () => {
      const addressData = {
        street: '123 Main St',
        postalCode: '12345',
      };

      const streetResult = getFieldValue('street', addressData, {});
      const postalResult = getFieldValue('postalCode', addressData, {});

      expect(streetResult).to.equal('123 Main St');
      expect(postalResult).to.equal('12345');
    });

    it('should handle undefined keys parameter', () => {
      const addressData = {
        street: '123 Main St',
        postalCode: '12345',
      };

      const streetResult = getFieldValue('street', addressData);
      const postalResult = getFieldValue('postalCode', addressData);

      expect(streetResult).to.equal('123 Main St');
      expect(postalResult).to.equal('12345');
    });

    it('should work with all address field types', () => {
      const addressData = {
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        addressLine3: 'Building C',
        cityName: 'Anytown',
        stateCode: 'CA',
        zipCode: '12345',
        countryCode: 'USA',
        militaryBase: true,
      };

      const keys = {
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        city: 'cityName',
        state: 'stateCode',
        postalCode: 'zipCode',
        country: 'countryCode',
        isMilitary: 'militaryBase',
      };

      expect(getFieldValue('street', addressData, keys)).to.equal(
        '123 Main St',
      );
      expect(getFieldValue('street2', addressData, keys)).to.equal('Apt 4B');
      expect(getFieldValue('street3', addressData, keys)).to.equal(
        'Building C',
      );
      expect(getFieldValue('city', addressData, keys)).to.equal('Anytown');
      expect(getFieldValue('state', addressData, keys)).to.equal('CA');
      expect(getFieldValue('postalCode', addressData, keys)).to.equal('12345');
      expect(getFieldValue('country', addressData, keys)).to.equal('USA');
      expect(getFieldValue('isMilitary', addressData, keys)).to.equal(true);
    });

    it('should handle empty string values correctly', () => {
      const addressData = {
        street: '',
        city: 'Anytown',
      };

      const result = getFieldValue('street', addressData);

      expect(result).to.equal('');
    });

    it('should handle false boolean values correctly', () => {
      const addressData = {
        isMilitary: false,
        street: '123 Main St',
      };

      const result = getFieldValue('isMilitary', addressData);

      expect(result).to.equal(false);
    });

    it('should handle zero numeric values correctly', () => {
      const addressData = {
        someNumericField: 0,
        street: '123 Main St',
      };

      const result = getFieldValue('someNumericField', addressData);

      expect(result).to.equal(0);
    });

    it('should prefer mapped key over standard key when both exist', () => {
      const addressData = {
        street: '123 Main St',
        addressLine1: '456 Oak Ave',
      };

      const keys = {
        street: 'addressLine1',
      };

      const result = getFieldValue('street', addressData, keys);

      // Should return the mapped field value, not the standard field value
      expect(result).to.equal('456 Oak Ave');
    });
  });

  describe('unsafe mapping warnings', () => {
    let consoleWarnStub;

    beforeEach(() => {
      consoleWarnStub = sinon.stub(console, 'warn');
    });

    afterEach(() => {
      consoleWarnStub.restore();
    });

    it('should not log warnings when only safe fields are mapped', () => {
      const schema = {
        street: { type: 'string' },
        street2: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const keys = {
        street: 'addressLine1',
        street2: 'addressLine2',
        postalCode: 'zipCode',
      };

      applyKeyMapping(schema, keys);

      expect(consoleWarnStub.called).to.be.false;
    });

    it('should not log warnings when all fields are safe to map', () => {
      const schema = {
        country: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        street: { type: 'string' },
        street2: { type: 'string' },
        street3: { type: 'string' },
        postalCode: { type: 'string' },
        isMilitary: { type: 'boolean' },
      };

      const keys = {
        country: 'countryCode',
        city: 'cityName',
        state: 'stateCode',
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        postalCode: 'zipCode',
        isMilitary: 'militaryBase',
      };

      applyKeyMapping(schema, keys);

      // All these fields are now safe to map
      expect(consoleWarnStub.called).to.be.false;
    });

    it('should log warnings for individual unsafe fields', () => {
      const schema = {
        unsafeField: { type: 'string' },
        street: { type: 'string' },
      };

      const keys = {
        unsafeField: 'customField',
      };

      expect(() => applyKeyMapping(schema, keys)).to.throw(
        /keys: Invalid key mappings: unsafeField. Valid mappable fields are: country, city, state, street, street2, street3, postalCode, isMilitary./,
      );
    });

    it('should handle multiple separate unsafe field mappings', () => {
      const schema = {
        unsafeField1: { type: 'string' },
        unsafeField2: { type: 'string' },
        street: { type: 'string' },
      };

      const keys = {
        unsafeField1: 'customField1',
        unsafeField2: 'customField2',
      };

      expect(() => applyKeyMapping(schema, keys)).to.throw(
        /keys: Invalid key mappings: unsafeField1, unsafeField2. Valid mappable fields are: country, city, state, street, street2, street3, postalCode, isMilitary./,
      );
    });

    it('should not log warnings when no mapping keys are provided', () => {
      const schema = {
        country: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
      };

      applyKeyMapping(schema, {}); // No keys provided

      expect(consoleWarnStub.called).to.be.false;
    });
  });

  describe('validateMilitaryBaseZipCode with key mappings', () => {
    let mockErrors;

    beforeEach(() => {
      mockErrors = {
        postalCode: { addError: sinon.spy() },
        zipCode: { addError: sinon.spy() },
        customPostalCode: { addError: sinon.spy() },
      };
    });

    it('should validate military zip codes without key mappings (standard behavior)', () => {
      const uiSchema = addressUI({});
      const addressData = {
        isMilitary: true,
        state: 'AE',
        postalCode: '09123', // Valid AE postal code
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.postalCode.addError.called).to.be.false;
    });

    it('should validate military zip codes with isMilitary field mapped', () => {
      const keys = { isMilitary: 'militaryBase' };
      const uiSchema = addressUI({ keys });

      const addressData = {
        militaryBase: true, // Mapped field
        state: 'AE',
        postalCode: '09123', // Valid AE postal code
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.postalCode.addError.called).to.be.false;
    });

    it('should validate military zip codes with postalCode field mapped', () => {
      const keys = { postalCode: 'zipCode' };
      const uiSchema = addressUI({ keys });

      const addressData = {
        isMilitary: true,
        state: 'AE',
        zipCode: '09123', // Mapped field with valid AE postal code
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.zipCode.addError.called).to.be.false;
    });

    it('should validate military zip codes with both fields mapped', () => {
      const keys = {
        isMilitary: 'militaryBase',
        postalCode: 'zipCode',
      };
      const uiSchema = addressUI({ keys });

      const addressData = {
        militaryBase: true, // Mapped isMilitary field
        state: 'AE',
        zipCode: '09123', // Mapped postalCode field with valid AE postal code
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.zipCode.addError.called).to.be.false;
    });

    it('should add errors to mapped postalCode field when validation fails', () => {
      const keys = { postalCode: 'zipCode' };
      const uiSchema = addressUI({ keys });

      const addressData = {
        isMilitary: true,
        state: 'AE',
        zipCode: '12345', // Invalid for AE state (should be 09xxx)
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.zipCode.addError.calledOnce).to.be.true;
      expect(mockErrors.postalCode.addError.called).to.be.false;
    });

    it('should validate AA state with correct postal codes using mapped fields', () => {
      const keys = {
        isMilitary: 'militaryBase',
        postalCode: 'zipCode',
      };
      const uiSchema = addressUI({ keys });

      const addressData = {
        militaryBase: true,
        state: 'AA',
        zipCode: '34012', // Valid AA postal code
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.zipCode.addError.called).to.be.false;
    });

    it('should add error for AA state with incorrect postal code using mapped fields', () => {
      const keys = {
        isMilitary: 'militaryBase',
        postalCode: 'zipCode',
      };
      const uiSchema = addressUI({ keys });

      const addressData = {
        militaryBase: true,
        state: 'AA',
        zipCode: '12345', // Invalid for AA state (should be 340xx)
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.zipCode.addError.calledOnce).to.be.true;
    });

    it('should validate AP state with correct postal codes using mapped fields', () => {
      const keys = {
        isMilitary: 'militaryBase',
        postalCode: 'zipCode',
      };
      const uiSchema = addressUI({ keys });

      const addressData = {
        militaryBase: true,
        state: 'AP',
        zipCode: '96234', // Valid AP postal code
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.zipCode.addError.called).to.be.false;
    });

    it('should add error for AP state with incorrect postal code using mapped fields', () => {
      const keys = {
        isMilitary: 'militaryBase',
        postalCode: 'zipCode',
      };
      const uiSchema = addressUI({ keys });

      const addressData = {
        militaryBase: true,
        state: 'AP',
        zipCode: '12345', // Invalid for AP state (should be 962xx-966xx)
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.zipCode.addError.calledOnce).to.be.true;
    });

    it('should not validate when isMilitary field is false with mapped field', () => {
      const keys = { isMilitary: 'militaryBase' };
      const uiSchema = addressUI({ keys });

      const addressData = {
        militaryBase: false, // Not military
        state: 'AE',
        postalCode: '12345', // Invalid military code but should not be validated
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.postalCode.addError.called).to.be.false;
    });

    it('should not validate when state field is missing', () => {
      const keys = {
        isMilitary: 'militaryBase',
        postalCode: 'zipCode',
      };
      const uiSchema = addressUI({ keys });

      const addressData = {
        militaryBase: true,
        // state is missing
        zipCode: '12345',
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.zipCode.addError.called).to.be.false;
    });

    it('should not validate for non-military states even when isMilitary is mapped', () => {
      const keys = {
        isMilitary: 'militaryBase',
        postalCode: 'zipCode',
      };
      const uiSchema = addressUI({ keys });

      const addressData = {
        militaryBase: true,
        state: 'CA', // Non-military state
        zipCode: '12345',
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.zipCode.addError.called).to.be.false;
    });

    it('should handle edge case with custom mapped field names', () => {
      const keys = {
        isMilitary: 'isOnMilitaryBase',
        postalCode: 'customPostalCode',
      };
      const uiSchema = addressUI({ keys });

      const addressData = {
        isOnMilitaryBase: true,
        state: 'AE',
        customPostalCode: '12345', // Invalid for AE
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.customPostalCode.addError.calledOnce).to.be.true;
      expect(mockErrors.postalCode.addError.called).to.be.false;
      expect(mockErrors.zipCode.addError.called).to.be.false;
    });

    it('should include mapped field name in error message', () => {
      const keys = {
        isMilitary: 'militaryBase',
        postalCode: 'zipCode',
      };
      const uiSchema = addressUI({ keys });

      const addressData = {
        militaryBase: true,
        state: 'AE',
        zipCode: '12345', // Invalid for AE
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.zipCode.addError.calledOnce).to.be.true;
      const errorMessage = mockErrors.zipCode.addError.getCall(0).args[0];
      expect(errorMessage).to.include(
        'This postal code is within the United States',
      );
      expect(errorMessage).to.include('APO/FPO/DPO address');
    });

    it('should handle mixed mapping scenarios correctly', () => {
      const keys = {
        isMilitary: 'militaryBase',
        // postalCode is not mapped, should use standard field
      };
      const uiSchema = addressUI({ keys });

      const addressData = {
        militaryBase: true, // Mapped field
        state: 'AE',
        postalCode: '12345', // Standard field name, invalid for AE
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.postalCode.addError.calledOnce).to.be.true;
      expect(mockErrors.zipCode.addError.called).to.be.false;
    });

    it('should validate with partial postal codes using mapped fields', () => {
      const keys = {
        isMilitary: 'militaryBase',
        postalCode: 'zipCode',
      };
      const uiSchema = addressUI({ keys });

      // Test partial valid codes
      const testCases = [
        { state: 'AA', zipCode: '340', expected: false }, // Valid AA start
        { state: 'AE', zipCode: '090', expected: false }, // Valid AE start (3 chars minimum)
        { state: 'AP', zipCode: '962', expected: false }, // Valid AP start
        { state: 'AA', zipCode: '341', expected: true }, // Invalid AA start
        { state: 'AE', zipCode: '080', expected: true }, // Invalid AE start
        { state: 'AP', zipCode: '961', expected: true }, // Invalid AP start
      ];

      testCases.forEach(({ state, zipCode, expected }) => {
        // Reset spy
        mockErrors.zipCode.addError.reset();

        const addressData = {
          militaryBase: true,
          state,
          zipCode,
        };

        uiSchema['ui:validations'][0](mockErrors, addressData);

        expect(mockErrors.zipCode.addError.called).to.equal(
          expected,
          `Expected ${
            expected ? 'error' : 'no error'
          } for state ${state} with zipCode ${zipCode}`,
        );
      });
    });

    it('should use custom military checkbox title in error messages', () => {
      const keys = {
        isMilitary: 'militaryBase',
        postalCode: 'zipCode',
      };
      const customLabel = 'Custom military base checkbox';
      const uiSchema = addressUI({
        keys,
        labels: { militaryCheckbox: customLabel },
      });

      const addressData = {
        militaryBase: true,
        state: 'AE',
        zipCode: '12345', // Invalid for AE
      };

      uiSchema['ui:validations'][0](mockErrors, addressData);

      expect(mockErrors.zipCode.addError.calledOnce).to.be.true;
      const errorMessage = mockErrors.zipCode.addError.getCall(0).args[0];
      expect(errorMessage).to.include(customLabel);
    });
  });

  describe('extendFieldProperties utility', () => {
    it('should extend field properties with additional schema properties', () => {
      const properties = {
        street: { type: 'string', minLength: 1, maxLength: 100 },
        city: { type: 'string', minLength: 1, maxLength: 100 },
        postalCode: { type: 'string', pattern: '^[0-9]+$' },
      };

      const extend = {
        street: { maxLength: 30 },
        city: { maxLength: 18 },
        postalCode: { maxLength: 9 },
      };

      const result = extendFieldProperties(properties, extend);

      // Should preserve original properties and merge extensions
      expect(result.street).to.deep.equal({
        type: 'string',
        minLength: 1,
        maxLength: 30, // Extended value
      });

      expect(result.city).to.deep.equal({
        type: 'string',
        minLength: 1,
        maxLength: 18, // Extended value
      });

      expect(result.postalCode).to.deep.equal({
        type: 'string',
        pattern: '^[0-9]+$',
        maxLength: 9, // New property added
      });
    });

    it('should handle partial field extensions', () => {
      const properties = {
        street: { type: 'string', minLength: 1 },
        city: { type: 'string', minLength: 1 },
        state: { type: 'string' },
      };

      const extend = {
        street: { maxLength: 30 },
        // city not extended
        // state not extended
      };

      const result = extendFieldProperties(properties, extend);

      // Street should be extended
      expect(result.street).to.deep.equal({
        type: 'string',
        minLength: 1,
        maxLength: 30,
      });

      // City and state should remain unchanged
      expect(result.city).to.deep.equal({
        type: 'string',
        minLength: 1,
      });

      expect(result.state).to.deep.equal({
        type: 'string',
      });
    });

    it('should allow adding new properties to fields', () => {
      const properties = {
        street: { type: 'string' },
        postalCode: { type: 'string' },
      };

      const extend = {
        street: { maxLength: 30, minLength: 5, pattern: '^[A-Za-z0-9 ]+$' },
        postalCode: { default: '00000' },
      };

      const result = extendFieldProperties(properties, extend);

      expect(result.street).to.deep.equal({
        type: 'string',
        maxLength: 30,
        minLength: 5,
        pattern: '^[A-Za-z0-9 ]+$',
      });

      expect(result.postalCode).to.deep.equal({
        type: 'string',
        default: '00000',
      });
    });

    it('should override existing properties when extended', () => {
      const properties = {
        street: { type: 'string', maxLength: 100 },
        city: { type: 'string', minLength: 1 },
      };

      const extend = {
        street: { maxLength: 30 }, // Override existing maxLength
        city: { minLength: 2 }, // Override existing minLength
      };

      const result = extendFieldProperties(properties, extend);

      expect(result.street.maxLength).to.equal(30);
      expect(result.city.minLength).to.equal(2);
    });

    it('should return original properties when no extensions provided', () => {
      const properties = {
        street: { type: 'string' },
        city: { type: 'string' },
      };

      const result = extendFieldProperties(properties, {});

      expect(result).to.deep.equal(properties);
    });

    it('should handle undefined extend parameter', () => {
      const properties = {
        street: { type: 'string' },
        city: { type: 'string' },
      };

      const result = extendFieldProperties(properties);

      expect(result).to.deep.equal(properties);
    });

    it('should throw error for invalid field names in extend', () => {
      const properties = {
        street: { type: 'string' },
        city: { type: 'string' },
      };

      const extend = {
        street: { maxLength: 30 },
        invalidField: { maxLength: 20 },
      };

      expect(() => extendFieldProperties(properties, extend)).to.throw(
        /extend: Invalid key mappings: invalidField. Valid mappable fields are: country, city, state, street, street2, street3, postalCode, isMilitary/,
      );
    });
  });

  describe('addressSchema with extend option', () => {
    it('should extend field properties in schema', () => {
      const result = addressSchema({
        extend: {
          street: { maxLength: 30 },
          city: { maxLength: 18 },
          postalCode: { maxLength: 9 },
        },
      });

      expect(result.properties.street.maxLength).to.equal(30);
      expect(result.properties.city.maxLength).to.equal(18);
      expect(result.properties.postalCode.maxLength).to.equal(9);
    });

    it('should work with extend and omit together', () => {
      const result = addressSchema({
        omit: ['street3', 'isMilitary'],
        extend: {
          street: { maxLength: 30 },
          city: { maxLength: 18 },
        },
      });

      // Extended fields should have new values
      expect(result.properties.street.maxLength).to.equal(30);
      expect(result.properties.city.maxLength).to.equal(18);

      // Omitted fields should not exist
      expect(result.properties).to.not.have.property('street3');
      expect(result.properties).to.not.have.property('isMilitary');
    });

    it('should work with extend and keys together', () => {
      const result = addressSchema({
        keys: {
          street: 'addressLine1',
          postalCode: 'zipCode',
        },
        extend: {
          street: { maxLength: 30 }, // Using original key name
          postalCode: { maxLength: 9 }, // Using original key name
        },
      });

      // Should have mapped keys with extended properties
      expect(result.properties).to.have.property('addressLine1');
      expect(result.properties.addressLine1.maxLength).to.equal(30);

      expect(result.properties).to.have.property('zipCode');
      expect(result.properties.zipCode.maxLength).to.equal(9);

      // Should not have original keys
      expect(result.properties).to.not.have.property('street');
      expect(result.properties).to.not.have.property('postalCode');
    });

    it('should work with all options together (omit, extend, keys)', () => {
      const result = addressSchema({
        omit: ['street3', 'isMilitary'],
        extend: {
          street: { maxLength: 30 },
          street2: { maxLength: 5 },
          city: { maxLength: 18 },
          state: { maxLength: 2 },
          postalCode: { maxLength: 9 },
          country: { default: 'USA', maxLength: 3 },
        },
        keys: {
          street: 'addressLine1',
          street2: 'addressLine2',
        },
      });

      // Should have mapped keys with extensions
      expect(result.properties.addressLine1.maxLength).to.equal(30);
      expect(result.properties.addressLine2.maxLength).to.equal(5);

      // Should have extended unmapped fields
      expect(result.properties.city.maxLength).to.equal(18);
      expect(result.properties.state.maxLength).to.equal(2);
      expect(result.properties.postalCode.maxLength).to.equal(9);
      expect(result.properties.country.default).to.equal('USA');
      expect(result.properties.country.maxLength).to.equal(3);

      // Should not have omitted fields
      expect(result.properties).to.not.have.property('street3');
      expect(result.properties).to.not.have.property('isMilitary');
    });

    it('should apply extend before key mapping', () => {
      // This ensures extensions use original field names
      const result = addressSchema({
        extend: {
          street: { maxLength: 30, customProp: 'test' },
        },
        keys: {
          street: 'addressLine1',
        },
      });

      // The extended properties should be on the mapped key
      expect(result.properties.addressLine1.maxLength).to.equal(30);
      expect(result.properties.addressLine1.customProp).to.equal('test');
    });

    it('should validate extend field names', () => {
      expect(() =>
        addressSchema({
          extend: {
            street: { maxLength: 30 },
            invalidField: { maxLength: 20 },
          },
        }),
      ).to.throw(
        /extend: Invalid key mappings: invalidField. Valid mappable fields are/,
      );
    });

    it('should handle empty extend object', () => {
      const result = addressSchema({ extend: {} });

      // Should return schema without modifications (besides normal defaults)
      expect(result.properties).to.have.property('street');
      expect(result.properties).to.have.property('city');
      expect(result.properties).to.have.property('postalCode');
    });
  });

  describe('custom validations option', () => {
    describe('array validations (whole address)', () => {
      it('should add array validations to ui:validations', () => {
        const customValidation = sinon.spy();
        const result = addressUI({
          validations: [customValidation],
        });

        expect(result['ui:validations'].length).to.equal(2); // 1 custom + 1 default military validation
        expect(result['ui:validations']).to.be.an('array');
        expect(result['ui:validations']).to.include(customValidation);
      });

      it('should concatenate multiple array validations', () => {
        const validation1 = sinon.spy();
        const validation2 = sinon.spy();
        const result = addressUI({
          validations: [validation1, validation2],
        });

        expect(result['ui:validations'].length).to.equal(3); // 2 custom + 1 default military validation
        expect(result['ui:validations']).to.include(validation1);
        expect(result['ui:validations']).to.include(validation2);
      });

      it('should have 1 validation by default', () => {
        const result = addressUI();
        expect(result['ui:validations'].length).to.equal(1); // default military validation
      });
    });

    describe('object validations (field-specific)', () => {
      it('should add field-specific validations', () => {
        const streetValidation = sinon.spy();
        const result = addressUI({
          validations: {
            street: [streetValidation],
          },
        });

        expect(result['ui:validations'].length).to.equal(1); // default military validation
        expect(result.street['ui:validations']).to.be.an('array');
        expect(result.street['ui:validations'].length).to.equal(1);
        expect(result.street['ui:validations']).to.include(streetValidation);
      });
    });
  });
});
