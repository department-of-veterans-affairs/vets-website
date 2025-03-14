import get from '@department-of-veterans-affairs/platform-forms-system/get';
import set from '@department-of-veterans-affairs/platform-forms-system/set';
import { states } from '@department-of-veterans-affairs/platform-forms/address';
import unset from '@department-of-veterans-affairs/platform-utilities/unset';
import { expect } from 'chai';
import { createSelector } from 'reselect';
import fullSchema from '../../../config/0873-schema.json';
import {
  isMilitaryCity,
  schema,
  uiSchema,
} from '../../../config/schema-helpers/addressHelper';

export const stateRequiredCountries = new Set(['USA', 'CAN', 'MEX']);

const militaryStates = ['AE', 'AP', 'AA'];
const militaryLabels = [
  'Armed Forces Europe',
  'Armed Forces Pacific',
  'Armed Forces Americas',
];
const usaStates = states.USA.map(state => state.value);
const usaLabels = states.USA.map(state => state.label);
const canProvinces = states.CAN.map(state => state.value);
const canLabels = states.CAN.map(state => state.label);
const mexStates = states.MEX.map(state => state.value);
const mexLabels = states.MEX.map(state => state.label);

describe('Address Page Schema and UI Schema', () => {
  describe('schema function', () => {
    it('should create a schema with required fields when isRequired is true', () => {
      const result = schema(fullSchema, true);
      expect(result.required).to.include.members([
        'street',
        'city',
        'country',
        'state',
        'postalCode',
      ]);
    });

    it('should not have required fields when isRequired is false', () => {
      const result = schema(fullSchema, false);
      expect(result.required).to.be.empty;
    });

    it('should set address property correctly', () => {
      const result = schema(fullSchema, true, 'address');
      expect(result.properties).to.have.property('street');
      expect(result.properties).to.have.property('city');
    });

    it('should customize properties correctly', () => {
      const result = schema(fullSchema, true, 'address');
      expect(result.properties).to.have.property('state');
      expect(result.properties.state).to.have.property('type', 'string');
      expect(result.properties.state).to.have.property('maxLength', 51);
    });
  });

  describe('uiSchema function', () => {
    it('should create a UI schema with all fields including street3 when useStreet3 is true', () => {
      const result = uiSchema('Test Address', true);
      expect(result['ui:order']).to.include('street3');
    });

    it('should not include street3 when useStreet3 is false', () => {
      const result = uiSchema('Test Address', false);
      expect(result['ui:order']).to.not.include('street3');
    });

    it('should set correct ui:title for fields', () => {
      const result = uiSchema('Test Address', true);
      expect(result.street['ui:title']).to.equal('Street address');
      expect(result.city['ui:title']).to.equal('City');
    });

    it('should set ui:required based on function', () => {
      const result = uiSchema('Test Address', true);
      expect(result.street['ui:required']()).to.be.true;
      expect(result.city['ui:required']({ onBaseOutsideUS: false })).to.be.true;
    });

    it('should handle military address visibility correctly', () => {
      const result = uiSchema('Test Address', true);
      expect(
        result.militaryAddress['ui:options'].hideIf({ onBaseOutsideUS: false }),
      ).to.be.true;
      expect(
        result.militaryAddress['ui:options'].hideIf({ onBaseOutsideUS: true }),
      ).to.be.false;
    });

    it('should handle state field visibility correctly', () => {
      const result = uiSchema('Test Address', true);
      expect(result.state['ui:options'].hideIf({ onBaseOutsideUS: false })).to
        .be.false;
      expect(result.state['ui:options'].hideIf({ onBaseOutsideUS: true })).to.be
        .true;
    });

    it('should handle state field requirement based on country', () => {
      const result = uiSchema('Test Address', true);
      expect(
        result.state['ui:required']({ onBaseOutsideUS: false, country: 'USA' }),
      ).to.be.true;
      expect(
        result.state['ui:required']({ onBaseOutsideUS: false, country: 'CAN' }),
      ).to.be.false;
    });
  });

  describe('isMilitaryCity function', () => {
    it('should identify APO as a military city', () => {
      expect(isMilitaryCity('APO')).to.be.true;
    });

    it('should identify FPO as a military city', () => {
      expect(isMilitaryCity('FPO')).to.be.true;
    });

    it('should identify DPO as a military city', () => {
      expect(isMilitaryCity('DPO')).to.be.true;
    });

    it('should handle lowercase military cities', () => {
      expect(isMilitaryCity('apo')).to.be.true;
      expect(isMilitaryCity('fpo')).to.be.true;
      expect(isMilitaryCity('dpo')).to.be.true;
    });

    it('should handle military cities with whitespace', () => {
      expect(isMilitaryCity('  APO  ')).to.be.true;
      expect(isMilitaryCity('  FPO  ')).to.be.true;
    });

    it('should identify non-military cities correctly', () => {
      expect(isMilitaryCity('New York')).to.be.false;
      expect(isMilitaryCity('')).to.be.false;
      expect(isMilitaryCity(undefined)).to.be.false;
    });
  });

  describe('Address Change Selector', () => {
    const mockAddressSchema = {
      properties: {
        state: {
          enum: ['CA', 'TX', 'NY'],
          enumNames: ['California', 'Texas', 'New York'],
        },
      },
      required: ['street', 'city'],
    };

    const addressChangeSelector = createSelector(
      ({ formData }) => formData.country,
      ({ formData, path }) => get(path.concat('city'), formData),
      ({ addressSchema }) => addressSchema,
      (currentCountry, city, addressSchema) => {
        const schemaUpdate = {
          properties: addressSchema.properties,
          required: addressSchema.required,
        };

        const country = currentCountry || 'USA';

        let stateList;
        let labelList;
        if (country === 'USA') {
          stateList = usaStates;
          labelList = usaLabels;
        } else if (country === 'CAN') {
          stateList = canProvinces;
          labelList = canLabels;
        } else if (country === 'MEX') {
          stateList = mexStates;
          labelList = mexLabels;
        }

        if (stateList) {
          // We have a list and it's different, so we need to make schema updates
          if (addressSchema.properties.state.enum !== stateList) {
            const withEnum = set(
              'state.enum',
              stateList,
              schemaUpdate.properties,
            );
            schemaUpdate.properties = set(
              'state.enumNames',
              labelList,
              withEnum,
            );
          }

          // We don't have a state list for the current country, but there's an enum in the schema
          // so we need to update it
        } else if (addressSchema.properties.state.enum) {
          const withoutEnum = unset('state.enum', schemaUpdate.properties);
          schemaUpdate.properties = unset('state.enumNames', withoutEnum);
        }

        // We constrain the state list when someone picks a city that's a military base
        if (
          country === 'USA' &&
          isMilitaryCity(city) &&
          schemaUpdate.properties.state.enum !== militaryStates
        ) {
          const withEnum = set(
            'state.enum',
            militaryStates,
            schemaUpdate.properties,
          );
          schemaUpdate.properties = set(
            'state.enumNames',
            militaryLabels,
            withEnum,
          );
        }

        return schemaUpdate;
      },
    );

    it('should update schema when country is USA', () => {
      const result = addressChangeSelector({
        formData: { country: 'USA' },
        path: ['address'],
        addressSchema: mockAddressSchema,
      });
      expect(result.properties.state.enum).to.include.members(usaStates);
      expect(result.properties.state.enumNames).to.include.members(usaLabels);
    });

    it('should update schema when country is Canada', () => {
      const result = addressChangeSelector({
        formData: { country: 'CAN' },
        path: ['address'],
        addressSchema: mockAddressSchema,
      });
      expect(result.properties.state.enum).to.include.members(canProvinces);
      expect(result.properties.state.enumNames).to.include.members(canLabels);
    });

    it('should update schema when country is Mexico', () => {
      const result = addressChangeSelector({
        formData: { country: 'MEX' },
        path: ['address'],
        addressSchema: mockAddressSchema,
      });
      expect(result.properties.state.enum).to.include.members(mexStates);
      expect(result.properties.state.enumNames).to.include.members(mexLabels);
    });

    it('should remove enum when country is not USA, Canada, or Mexico', () => {
      const result = addressChangeSelector({
        formData: { country: 'GBR' },
        path: ['address'],
        addressSchema: mockAddressSchema,
      });
      expect(result.properties.state).to.not.have.property('enum');
      expect(result.properties.state).to.not.have.property('enumNames');
    });

    it('should update schema when city is a military base', () => {
      const mockSchema = {
        properties: {
          state: {
            enum: usaStates,
            enumNames: usaLabels,
          },
        },
      };
      const result = addressChangeSelector({
        formData: { country: 'USA', city: 'APO' },
        addressSchema: mockSchema,
        path: [],
      });
      expect(result.properties.state.enum).to.deep.equal(militaryStates);
      expect(result.properties.state.enumNames).to.deep.equal(militaryLabels);
    });

    it('should not update schema when state list matches current enum', () => {
      const mockSchemaWithUSAStates = {
        properties: {
          state: {
            enum: usaStates,
            enumNames: usaLabels,
          },
        },
        required: ['street', 'city'],
      };

      const result = addressChangeSelector({
        formData: { country: 'USA' },
        path: ['address'],
        addressSchema: mockSchemaWithUSAStates,
      });
      expect(result.properties.state.enum).to.equal(usaStates);
      expect(result.properties.state.enumNames).to.equal(usaLabels);
    });

    it('should handle undefined country by defaulting to USA', () => {
      const result = addressChangeSelector({
        formData: {},
        path: ['address'],
        addressSchema: mockAddressSchema,
      });
      expect(result.properties.state.enum).to.include.members(usaStates);
      expect(result.properties.state.enumNames).to.include.members(usaLabels);
    });
  });
});
