import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import {
  schema,
  uiSchema,
  validateNotAllWhiteSpaces,
} from '../../definitions/address';

describe('platform/forms/address', () => {
  describe('validateNotAllWhiteSpaces', () => {
    it('should add error if field is all spaces and required', () => {
      const errors = { addError: sinon.spy() };
      validateNotAllWhiteSpaces(errors, '   ', ['street'], 'street');
      expect(errors.addError.calledWith('Please provide a response')).to.be
        .true;
    });

    it('should not add error if field is not required', () => {
      const errors = { addError: sinon.spy() };
      validateNotAllWhiteSpaces(errors, '   ', [], 'street');
      expect(errors.addError.called).to.be.false;
    });

    it('should not add error if field is not all spaces', () => {
      const errors = { addError: sinon.spy() };
      validateNotAllWhiteSpaces(errors, '123 Main', ['street'], 'street');
      expect(errors.addError.called).to.be.false;
    });
  });

  describe('schema', () => {
    const baseSchema = {
      definitions: {
        address: {
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' },
            state: { type: 'string' },
            postalCode: { type: 'string' },
          },
        },
      },
    };

    it('should include required fields if isRequired is true', () => {
      const addressSchema = schema(baseSchema, true);
      expect(addressSchema.required).to.include.members([
        'street',
        'city',
        'country',
        'state',
        'postalCode',
      ]);
    });

    it('should not include required fields if isRequired is false', () => {
      const addressSchema = schema(baseSchema, false);
      expect(addressSchema.required).to.be.empty;
    });

    it('should set country enum and default', () => {
      const addressSchema = schema(baseSchema, false);
      expect(addressSchema.properties.country.enum).to.be.an('array');
      expect(addressSchema.properties.country.default).to.equal('USA');
    });
  });

  describe('uiSchema', () => {
    it('should use VaTextInputField for street, city, postalCode', () => {
      const addressUi = uiSchema();
      expect(addressUi.street['ui:webComponentField'].name).to.include(
        'VaTextInputField',
      );
      expect(addressUi.city['ui:webComponentField'].name).to.include(
        'VaTextInputField',
      );
      expect(addressUi.postalCode['ui:webComponentField'].name).to.include(
        'VaTextInputField',
      );
    });

    it('should set correct error messages for postalCode by country', () => {
      const addressUi = uiSchema();
      const _schema = {};
      const _uiSchema = {};

      // USA
      addressUi.postalCode['ui:options'].replaceSchema(
        { country: 'USA' },
        _schema,
        _uiSchema,
        0,
        ['address', 'postalCode'],
      );
      expect(_uiSchema['ui:errorMessages'].required).to.equal(
        'Enter a postal code',
      );

      // CAN
      addressUi.postalCode['ui:options'].replaceSchema(
        { country: 'CAN' },
        _schema,
        _uiSchema,
        0,
        ['address', 'postalCode'],
      );
      expect(_uiSchema['ui:errorMessages'].required).to.equal(
        'Enter a postal code',
      );

      // Other
      addressUi.postalCode['ui:options'].replaceSchema(
        { country: 'FRA' },
        _schema,
        _uiSchema,
        0,
        ['address', 'postalCode'],
      );
      expect(_uiSchema['ui:errorMessages'].required).to.include(
        'Enter a postal code',
      );
    });

    it('should set Province title for CAN', () => {
      const addressUi = uiSchema();
      const { updateSchema } = addressUi['ui:options'];
      const formData = { country: 'CAN' };
      const addressSchema = {
        properties: {
          state: { title: 'State' },
          country: { default: 'CAN' },
        },
        required: ['state'],
      };
      const result = updateSchema(formData, addressSchema, {}, 0, []);
      expect(result.properties.state.title).to.equal('Province');
    });

    it('should set State title for USA', () => {
      const addressUi = uiSchema();
      const { updateSchema } = addressUi['ui:options'];
      const formData = { country: 'USA' };
      const addressSchema = {
        properties: {
          state: { title: 'Province' },
          country: { default: 'USA' },
        },
        required: ['state'],
      };
      const result = updateSchema(formData, addressSchema, {}, 0, []);
      expect(result.properties.state.title).to.equal('State');
    });
  });

  describe('accessibility', () => {
    it('should render address fields with accessible labels', () => {
      const addressUi = uiSchema();
      const { container } = render(
        <form>
          <va-text-input
            label={addressUi.street['ui:title']}
            name="street"
            data-testid="street"
          />
          <va-text-input
            label={addressUi.city['ui:title']}
            name="city"
            data-testid="city"
          />
          <va-text-input
            label={addressUi.postalCode['ui:title']}
            name="postalCode"
            data-testid="postalCode"
          />
        </form>,
      );
      expect(container.querySelector('va-text-input[label="Street"]')).to.exist;
      expect(container.querySelector('va-text-input[label="City"]')).to.exist;
      expect(container.querySelector('va-text-input[label="Postal code"]')).to
        .exist;
    });
  });
});
