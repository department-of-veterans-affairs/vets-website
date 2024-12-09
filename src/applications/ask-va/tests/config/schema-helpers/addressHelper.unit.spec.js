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

const militaryStates = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.value);
const militaryLabels = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.label);
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
  });

  describe('isMilitaryCity function', () => {
    it('should identify APO as a military city', () => {
      expect(isMilitaryCity('APO')).to.be.true;
    });

    it('should identify non-military cities correctly', () => {
      expect(isMilitaryCity('New York')).to.be.false;
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
          // We have a list and it’s different, so we need to make schema updates
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

          // We don’t have a state list for the current country, but there’s an enum in the schema
          // so we need to update it
        } else if (addressSchema.properties.state.enum) {
          const withoutEnum = unset('state.enum', schemaUpdate.properties);
          schemaUpdate.properties = unset('state.enumNames', withoutEnum);
        }

        // We constrain the state list when someone picks a city that’s a military base
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
      expect(result.properties.state.enum).to.include.members([
        'CA',
        'TX',
        'NY',
      ]);
    });

    it('should update schema when city is a military base', () => {
      const result = addressChangeSelector({
        formData: { country: 'USA', city: 'APO' },
        path: ['address'],
        addressSchema: mockAddressSchema,
      });
      expect(result.properties.state.enum).to.include.members([
        'AE',
        'AP',
        'AA',
      ]);
    });
  });
});
