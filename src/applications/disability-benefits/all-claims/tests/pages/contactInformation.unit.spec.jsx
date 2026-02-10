import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/react';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';
import { MILITARY_STATE_VALUES } from 'applications/disability-benefits/all-claims/constants';
import { commonReducer } from 'platform/startup/store';
import formConfig from '../../config/form';
import reducers from '../../reducers';
import {
  uiSchema,
  schema,
  updateFormData,
} from '../../pages/contactInformation';

describe('Disability benefits 526EZ contact information', () => {
  let sandbox;

  const fakeStore = createStore(
    combineReducers({
      ...commonReducer,
      ...reducers,
    }),
  );

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('contactInformation page', () => {
    describe('state field validation functions', () => {
      it('should require state for USA addresses', () => {
        const requiredFn = uiSchema.mailingAddress.state['ui:required'];
        const result = requiredFn({
          mailingAddress: {
            country: 'USA',
            'view:livesOnMilitaryBase': false,
          },
        });

        expect(result).to.be.true;
      });
      it('should require state for military addresses', () => {
        const requiredFn = uiSchema.mailingAddress.state['ui:required'];
        const result = requiredFn({
          mailingAddress: {
            country: 'CAN',
            'view:livesOnMilitaryBase': true,
          },
        });

        expect(result).to.be.true;
      });

      it('should not require state for non-USA, non-military addresses', () => {
        const requiredFn = uiSchema.mailingAddress.state['ui:required'];
        const result = requiredFn({
          mailingAddress: {
            country: 'CAN',
            'view:livesOnMilitaryBase': false,
          },
        });

        expect(result).to.be.false;
      });
    });

    describe('state field visibility logic', () => {
      it('should hide state field for non-USA countries', () => {
        const hideIfFn = uiSchema.mailingAddress.state['ui:options'].hideIf;
        const result = hideIfFn({
          mailingAddress: {
            country: 'CAN',
            'view:livesOnMilitaryBase': false,
          },
        });

        expect(result).to.be.true;
      });

      it('should not hide state field for USA', () => {
        const hideIfFn = uiSchema.mailingAddress.state['ui:options'].hideIf;
        const result = hideIfFn({
          mailingAddress: {
            country: 'USA',
            'view:livesOnMilitaryBase': false,
          },
        });

        expect(result).to.be.false;
      });

      it('should not hide state field for military addresses', () => {
        const hideIfFn = uiSchema.mailingAddress.state['ui:options'].hideIf;
        const result = hideIfFn({
          mailingAddress: {
            country: 'CAN',
            'view:livesOnMilitaryBase': true,
          },
        });

        expect(result).to.be.false;
      });
    });

    describe('state field schema transformation', () => {
      let updateSchemaFn;

      beforeEach(() => {
        updateSchemaFn =
          uiSchema.mailingAddress.state['ui:options'].updateSchema;
      });

      it('should return military states schema for military addresses', () => {
        const mockUiSchema = {
          'ui:webComponentField': null,
          'ui:errorMessages': {},
        };

        const result = updateSchemaFn(
          {
            mailingAddress: {
              'view:livesOnMilitaryBase': true,
              country: 'USA',
            },
          },
          {},
          mockUiSchema,
        );

        expect(result.enum).to.include('AA');
        expect(result.enum).to.include('AE');
        expect(result.enum).to.include('AP');
        expect(result.enumNames).to.have.lengthOf(3);

        expect(result.enumNames).to.include.members([
          'Armed Forces Americas (AA)',
          'Armed Forces Europe (AE)',
          'Armed Forces Pacific (AP)',
        ]);
      });

      it('should return US states schema for USA addresses', () => {
        const mockUiSchema = {
          'ui:webComponentField': null,
          'ui:errorMessages': {},
        };

        const result = updateSchemaFn(
          {
            mailingAddress: {
              'view:livesOnMilitaryBase': false,
              country: 'USA',
            },
          },
          {},
          mockUiSchema,
        );

        expect(result.enum).to.be.an('array');
        expect(result.enum).to.not.include('AA');
        expect(result.enum).to.include('CA');
      });

      it('should auto-detect military states from prefill data and return radio buttons', () => {
        const mockUiSchema = {
          'ui:webComponentField': null,
          'ui:errorMessages': {},
        };

        const result = updateSchemaFn(
          {
            mailingAddress: {
              'view:livesOnMilitaryBase': false, // Prefill data didn't set flag
              city: 'Regular City',
              state: 'AA', // But backend provided military state
              country: 'USA',
            },
          },
          {},
          mockUiSchema,
        );

        // Should return military states schema
        expect(result.enum).to.include('AA');
        expect(result.enum).to.include('AE');
        expect(result.enum).to.include('AP');
        // Should have set the component to radio buttons
        expect(mockUiSchema['ui:webComponentField']).to.equal(VaRadioField);
        expect(mockUiSchema['ui:errorMessages']).to.deep.equal({
          enum: 'Please select a military state',
        });
      });

      it('should auto-detect military cities typed by user and return radio buttons', () => {
        const mockUiSchema = {
          'ui:webComponentField': null,
          'ui:errorMessages': {},
        };

        const result = updateSchemaFn(
          {
            mailingAddress: {
              'view:livesOnMilitaryBase': false, // Not explicitly set
              city: 'APO', // User typed military city in text field
              state: 'NY', // Regular state selected
              country: 'USA',
            },
          },
          {},
          mockUiSchema,
        );

        // Should return military states schema due to military city
        expect(result.enum).to.include('AA');
        expect(result.enum).to.include('AE');
        expect(result.enum).to.include('AP');
        // Should have set the component to radio buttons
        expect(mockUiSchema['ui:webComponentField']).to.equal(VaRadioField);
        expect(mockUiSchema['ui:errorMessages']).to.deep.equal({
          enum: 'Please select a military state',
        });
      });
    });

    describe('country field schema transformation', () => {
      let updateSchemaFn;

      beforeEach(() => {
        updateSchemaFn =
          uiSchema.mailingAddress.country['ui:options'].updateSchema;
      });

      it('should return USA only for military addresses', () => {
        const mockUiSchema = {
          'ui:options': { inert: false },
        };

        const mockFormData = {
          mailingAddress: {
            'view:livesOnMilitaryBase': true,
            country: 'USA',
          },
        };

        const result = updateSchemaFn(mockFormData, {}, mockUiSchema);

        expect(result.enum).to.deep.equal(['USA']);
        expect(result.enumNames).to.deep.equal(['USA']);
        expect(result.default).to.equal('USA');
        expect(mockUiSchema['ui:options'].inert).to.be.true;
        expect(mockFormData.mailingAddress.country).to.equal('USA');
      });

      it('should return all countries for regular addresses', () => {
        const mockUiSchema = {
          'ui:options': { inert: true },
        };

        const result = updateSchemaFn(
          {
            mailingAddress: {
              'view:livesOnMilitaryBase': false,
            },
          },
          {},
          mockUiSchema,
        );

        expect(result.type).to.equal('string');
        expect(result.enum).to.be.an('array');
        expect(result.enum.length).to.be.greaterThan(1);
        expect(mockUiSchema['ui:options'].inert).to.be.false;
      });
    });

    describe('updateFormData function', () => {
      it('should process form data updates correctly', () => {
        const oldData = { mailingAddress: { city: 'Old City' } };
        const newData = { mailingAddress: { city: 'New City' } };

        const result = updateFormData(oldData, newData);

        expect(result).to.be.an('object');
      });

      it('should handle missing mailing address data gracefully', () => {
        const oldData = {};
        const newData = { phoneAndEmail: { primaryPhone: '1234567890' } };

        expect(() => updateFormData(oldData, newData)).to.not.throw();
      });
      describe('military base checkbox behavior', () => {
        const createFormData = (checkbox, city = '', state = '') => ({
          mailingAddress: {
            'view:livesOnMilitaryBase': checkbox,
            city,
            state,
          },
        });

        const emptyMilitaryData = createFormData(true, '', '');
        const regularAddressData = createFormData(false, 'city', 'state');

        it('should maintain current city and state values', () => {
          const newData = createFormData(true, 'city', 'state');
          expect(
            updateFormData(emptyMilitaryData, emptyMilitaryData),
          ).to.deep.equal(emptyMilitaryData);
          expect(
            updateFormData(regularAddressData, regularAddressData),
          ).to.deep.equal(regularAddressData);
          expect(updateFormData(newData, newData)).to.deep.equal(newData);
        });

        it('should clear city and state when military checkbox is selected', () => {
          const newData = createFormData(true, 'city', 'state');
          expect(updateFormData(regularAddressData, newData)).to.deep.equal(
            emptyMilitaryData,
          );
        });

        it('should restore city and state when military checkbox is deselected', () => {
          const oldData = createFormData(true, 'city', 'state');
          const newData = createFormData(false, 'city', 'state');
          expect(updateFormData(oldData, newData)).to.deep.equal(newData);
        });

        it('should clear military city when military checkbox is deselected', () => {
          const militarySet = createFormData(true, 'APO', 'AA');
          const regularData = createFormData(false, 'city', 'state');
          const result = createFormData(false, 'city', 'state');
          expect(updateFormData(militarySet, regularData)).to.deep.equal(
            result,
          );
        });
      });

      describe('military auto-detection logic', () => {
        it('should auto-detect military base when user types military city', () => {
          const oldData = {
            mailingAddress: {
              'view:livesOnMilitaryBase': false,
              city: 'Regular City',
              state: 'CA',
            },
          };
          const newData = {
            mailingAddress: {
              'view:livesOnMilitaryBase': false, // Not explicitly changed
              city: 'APO', // User typed military city in text field
              state: 'CA',
            },
          };

          const result = updateFormData(oldData, newData);

          expect(result.mailingAddress['view:livesOnMilitaryBase']).to.be.true;
          expect(result.mailingAddress.city).to.equal('APO');
          expect(result.mailingAddress.state).to.equal('CA');
        });

        it('should auto-detect military base from prefilled/IPF data with military state', () => {
          const oldData = {
            mailingAddress: {
              'view:livesOnMilitaryBase': false,
              city: 'Some City',
              state: 'CA',
            },
          };
          const newData = {
            mailingAddress: {
              'view:livesOnMilitaryBase': false, // Prefill/IPF didn't set this flag
              city: 'Some City',
              state: 'AE', // But backend provided military state
            },
          };

          const result = updateFormData(oldData, newData);

          expect(result.mailingAddress['view:livesOnMilitaryBase']).to.be.true;
          expect(result.mailingAddress.city).to.equal('Some City');
          expect(result.mailingAddress.state).to.equal('AE');
        });

        it('should handle prefilled/IPF data with both military city and state', () => {
          const oldData = {
            mailingAddress: {
              'view:livesOnMilitaryBase': false,
              city: 'Regular City',
              state: 'CA',
            },
          };
          const newData = {
            mailingAddress: {
              'view:livesOnMilitaryBase': false, // IPF/prefill missing flag
              city: 'FPO', // Military city from backend
              state: 'AP', // Military state from backend
            },
          };

          const result = updateFormData(oldData, newData);

          expect(result.mailingAddress['view:livesOnMilitaryBase']).to.be.true;
          expect(result.mailingAddress.city).to.equal('FPO');
          expect(result.mailingAddress.state).to.equal('AP');
        });

        it('should not auto-detect when neither military city nor state', () => {
          const oldData = {
            mailingAddress: {
              'view:livesOnMilitaryBase': false,
              city: 'Old City',
              state: 'CA',
            },
          };
          const newData = {
            mailingAddress: {
              'view:livesOnMilitaryBase': false,
              city: 'New York', // Regular city
              state: 'NY', // Regular state
            },
          };

          const result = updateFormData(oldData, newData);

          expect(result.mailingAddress['view:livesOnMilitaryBase']).to.be.false;
          expect(result.mailingAddress.city).to.equal('New York');
          expect(result.mailingAddress.state).to.equal('NY');
        });

        it('should not override user explicit choice to uncheck military box', () => {
          const oldData = {
            mailingAddress: {
              'view:livesOnMilitaryBase': true,
              city: 'APO',
              state: 'AA',
            },
          };
          const newData = {
            mailingAddress: {
              'view:livesOnMilitaryBase': false, // User explicitly unchecked
              city: 'city', // Form restored to default values (same as other tests)
              state: 'state',
            },
          };

          const result = updateFormData(oldData, newData);

          // Should respect user's explicit choice to uncheck (no auto-detection override)
          expect(result.mailingAddress['view:livesOnMilitaryBase']).to.be.false;
          expect(result.mailingAddress.city).to.equal('city');
          expect(result.mailingAddress.state).to.equal('state');
        });

        it('should handle missing mailingAddress gracefully', () => {
          const oldData = {};
          const newData = { phoneAndEmail: { primaryPhone: '1234567890' } };

          const result = updateFormData(oldData, newData);

          expect(result.phoneAndEmail.primaryPhone).to.equal('1234567890');
        });
      });
    });
    describe('contact information form rendering and behavior', () => {
      it('renders contact information form', () => {
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                mailingAddress: {},
                phoneAndEmail: {},
              }}
              formData={{}}
              uiSchema={uiSchema}
            />
          </Provider>,
        );
        // country
        expect(form.find('VaSelectField').length).to.equal(1);
        // address 1, 2, 3, city, (not zip without country)
        expect(form.find('VaTextInputField').length).to.equal(4);
        // Military checkbox
        expect(form.find('VaCheckboxField').length).to.equal(1);
        // state is hidden by default (because country is empty)

        form.unmount();
      });

      it('shows state and zip when country is USA', () => {
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                mailingAddress: {
                  country: 'USA',
                },
                phoneAndEmail: {},
              }}
              formData={{}}
              uiSchema={uiSchema}
            />
          </Provider>,
        );
        // country, state
        expect(form.find('VaSelectField').length).to.equal(2);
        // address 1, 2, 3, city, zip
        expect(form.find('VaTextInputField').length).to.equal(5);
        form.unmount();
      });

      it('hides state and zip when country is not USA', () => {
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                mailingAddress: {
                  country: 'Afghanistan',
                },
                phoneAndEmail: {},
              }}
              formData={{}}
              uiSchema={uiSchema}
            />
          </Provider>,
        );

        // country
        expect(form.find('VaSelectField').length).to.equal(1);
        // street 1, 2, 3, city
        expect(form.find('VaTextInputField').length).to.equal(4);
        form.unmount();
      });

      it('restricts state options to military state codes when city is a military city code', () => {
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                mailingAddress: {
                  country: 'USA',
                  city: 'APO',
                },
                phoneAndEmail: {},
              }}
              formData={{}}
              uiSchema={uiSchema}
            />
          </Provider>,
        );

        const stateDropdownOptions = form.find(
          'va-radio-option[name="root_mailingAddress_state"]',
        );
        // Military state radio buttons don't have an empty option
        expect(stateDropdownOptions.length).to.equal(
          MILITARY_STATE_VALUES.length,
        );
        form.unmount();
      });

      it('validates that state is military type if city is military type', async () => {
        const onSubmit = sinon.spy();
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                phoneAndEmail: {
                  primaryPhone: '1231231231',
                  emailAddress: 'a@b.co',
                },
                mailingAddress: {
                  country: 'USA',
                  addressLine1: '123 Any Street',
                  city: 'APO',
                  state: 'TX',
                  zipCode: '12345',
                },
              }}
              formData={{}}
              uiSchema={uiSchema}
              onSubmit={onSubmit}
            />
          </Provider>,
        );

        await waitFor(() => {
          form.find('form').simulate('submit');
          // VA web components show errors as props, not separate DOM elements
          expect(form.find('VaRadioField[error]').length).to.equal(1);
          expect(onSubmit.called).to.be.false;
        });
        form.unmount();
      });

      it('validates that city is military type if state is military type', async () => {
        const onSubmit = sinon.spy();
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                phoneAndEmail: {
                  primaryPhone: '1231231231',
                  emailAddress: 'a@b.co',
                },
                mailingAddress: {
                  country: 'USA',
                  addressLine1: '123 Any Street',
                  city: 'APO', // Military city
                  state: 'TX', // Non-military state - this creates invalid combination
                  zipCode: '12345',
                },
              }}
              formData={{}}
              uiSchema={uiSchema}
              onSubmit={onSubmit}
            />
          </Provider>,
        );

        await waitFor(() => {
          form.find('form').simulate('submit');

          // When city is military (APO), state becomes radio buttons for military states only
          // Having a military city (APO) with non-military state (TX) should cause validation error
          const radioErrors = form.find('VaRadioField[error]');
          expect(radioErrors.length).to.equal(1); // State field should show error
          expect(onSubmit.called).to.be.false;
        });
        form.unmount();
      });

      it('disables the country dropdown when overseas address is checked', () => {
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                mailingAddress: {
                  'view:livesOnMilitaryBase': true,
                  country: 'USA',
                },
                phoneAndEmail: {},
              }}
              formData={{}}
              uiSchema={uiSchema}
            />
          </Provider>,
        );

        // country
        expect(
          form
            .find('VaSelect')
            .at(0)
            .prop('inert'),
        ).to.be.true;
        form.unmount();
      });

      it('does not submit without required info', async () => {
        const onSubmit = sinon.spy();
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                phoneAndEmail: {
                  primaryPhone: '',
                  emailAddress: '',
                },
                mailingAddress: {
                  country: '',
                  addressLine1: '',
                  city: '',
                },
              }}
              formData={{}}
              onSubmit={onSubmit}
              uiSchema={uiSchema}
            />
          </Provider>,
        );

        await waitFor(() => {
          form.find('form').simulate('submit');
          // Count each type of field with errors separately (country, address1, city, email, phone)
          const selectErrors = form.find('VaSelectField[error]');
          const textInputErrors = form.find('VaTextInputField[error]');
          const totalErrors = selectErrors.length + textInputErrors.length;
          expect(totalErrors).to.equal(5);
          expect(onSubmit.called).to.be.false;
        });
        form.unmount();
      });

      it('does submit with required info', () => {
        const onSubmit = sinon.spy();
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                phoneAndEmail: {
                  emailAddress: 'a@b.co',
                },
                mailingAddress: {
                  'view:livesOnMilitaryBase': false,
                  country: 'USA',
                  addressLine1: '123 Any Street',
                  city: 'Anytown',
                  state: 'MI',
                  zipCode: '12345',
                },
              }}
              formData={{}}
              onSubmit={onSubmit}
              uiSchema={uiSchema}
            />
          </Provider>,
        );

        form.find('form').simulate('submit');
        // Check that no VA web components have error props
        const selectErrors = form.find('VaSelectField[error]');
        const textInputErrors = form.find('VaTextInputField[error]');
        const radioErrors = form.find('VaRadioField[error]');
        const checkboxErrors = form.find('VaCheckboxField[error]');
        const totalErrors =
          selectErrors.length +
          textInputErrors.length +
          radioErrors.length +
          checkboxErrors.length;

        expect(totalErrors).to.equal(0);
        expect(onSubmit.called).to.be.true;
        form.unmount();
      });
    });

    describe('ReviewCardField edit state for invalid prefilled addresses', () => {
      // Two mechanisms force the ReviewCardField to start in edit mode:
      //
      // 1. JSON schema maxLength (via `extend` on addressSchema): If a
      //    prefilled field exceeds the 526EZ limit (20 chars for address lines,
      //    30 for city), the JSON schema error makes errorSchemaIsValid() return
      //    false → edit mode.
      //
      // 2. startInEdit with hasInvalidPrefillData: If a prefilled field has
      //    disallowed characters (per the 526EZ regex pattern), the startInEdit
      //    function returns true → edit mode. This function normalizes spaces
      //    (trim + collapse) before checking the pattern — same logic as
      //    createAddressValidator — so extra spaces don't falsely trigger it.
      //    (See PR #42005 for the normalization rationale.)

      it('should start mailing address card in edit mode when addressLine1 exceeds 20 characters', () => {
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                phoneAndEmail: {
                  primaryPhone: '1231231231',
                  emailAddress: 'a@b.co',
                },
                mailingAddress: {
                  'view:livesOnMilitaryBase': false,
                  country: 'USA',
                  addressLine1: 'This Address Is Way Too Long For The Field',
                  city: 'Anytown',
                  state: 'MI',
                  zipCode: '12345',
                },
              }}
              formData={{}}
              uiSchema={uiSchema}
            />
          </Provider>,
        );

        // When invalid, ReviewCardField starts in edit mode which renders
        // the input-section class and a Save button instead of an Edit button
        const mailingSection = form.find('.review-card');
        // The second review-card is the mailing address (first is phone/email)
        const mailingCard = mailingSection.at(1);
        expect(mailingCard.find('.input-section').length).to.be.greaterThan(0);
        expect(mailingCard.find('.update-button').length).to.be.greaterThan(0);

        form.unmount();
      });

      it('should NOT start in edit mode for address with extra spaces (spaces are normalized before pattern check)', () => {
        // This is the key regression test for PR #42005 — extra spaces in
        // prefilled data should not trigger edit mode. The startInEdit
        // function (hasInvalidPrefillData) normalizes spaces before checking
        // the pattern, just like createAddressValidator does.
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                phoneAndEmail: {
                  primaryPhone: '1231231231',
                  emailAddress: 'a@b.co',
                },
                mailingAddress: {
                  'view:livesOnMilitaryBase': false,
                  country: 'USA',
                  addressLine1: '123  Main St',
                  city: 'Anytown',
                  state: 'MI',
                  zipCode: '12345',
                },
              }}
              formData={{}}
              uiSchema={uiSchema}
            />
          </Provider>,
        );

        const mailingSection = form.find('.review-card');
        const mailingCard = mailingSection.at(1);
        // Should be in view mode — extra spaces are normalized (collapsed)
        // before pattern check, so they don't trigger edit mode
        expect(mailingCard.find('.input-section').length).to.equal(0);
        expect(mailingCard.find('button.edit-button').exists()).to.be.true;

        form.unmount();
      });

      it('should start mailing address card in edit mode when addressLine1 has invalid characters', () => {
        // Disallowed characters (like @, !, %, etc.) should force edit mode
        // via the startInEdit / hasInvalidPrefillData function, which runs the
        // same normalized pattern check as createAddressValidator.
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                phoneAndEmail: {
                  primaryPhone: '1231231231',
                  emailAddress: 'a@b.co',
                },
                mailingAddress: {
                  'view:livesOnMilitaryBase': false,
                  country: 'USA',
                  addressLine1: '123 Main St @#!',
                  city: 'Anytown',
                  state: 'MI',
                  zipCode: '12345',
                },
              }}
              formData={{}}
              uiSchema={uiSchema}
            />
          </Provider>,
        );

        const mailingSection = form.find('.review-card');
        const mailingCard = mailingSection.at(1);
        // startInEdit detects invalid characters → edit mode
        expect(mailingCard.find('.input-section').length).to.be.greaterThan(0);
        expect(mailingCard.find('.update-button').length).to.be.greaterThan(0);

        form.unmount();
      });

      it('should start mailing address card in edit mode when city has invalid characters', () => {
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                phoneAndEmail: {
                  primaryPhone: '1231231231',
                  emailAddress: 'a@b.co',
                },
                mailingAddress: {
                  'view:livesOnMilitaryBase': false,
                  country: 'USA',
                  addressLine1: '123 Main St',
                  city: 'Any$town!',
                  state: 'MI',
                  zipCode: '12345',
                },
              }}
              formData={{}}
              uiSchema={uiSchema}
            />
          </Provider>,
        );

        const mailingSection = form.find('.review-card');
        const mailingCard = mailingSection.at(1);
        expect(mailingCard.find('.input-section').length).to.be.greaterThan(0);
        expect(mailingCard.find('.update-button').length).to.be.greaterThan(0);

        form.unmount();
      });

      it('should start mailing address card in view mode when address is valid', () => {
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                phoneAndEmail: {
                  primaryPhone: '1231231231',
                  emailAddress: 'a@b.co',
                },
                mailingAddress: {
                  'view:livesOnMilitaryBase': false,
                  country: 'USA',
                  addressLine1: '123 Main St',
                  city: 'Anytown',
                  state: 'MI',
                  zipCode: '12345',
                },
              }}
              formData={{}}
              uiSchema={uiSchema}
            />
          </Provider>,
        );

        const mailingSection = form.find('.review-card');
        const mailingCard = mailingSection.at(1);
        // In view mode, there should be no input-section
        expect(mailingCard.find('.input-section').length).to.equal(0);
        // Should have the Edit button in view mode
        expect(mailingCard.find('button.edit-button').exists()).to.be.true;

        form.unmount();
      });

      it('should start mailing address card in edit mode when addressLine2 exceeds 20 characters', () => {
        const form = mount(
          <Provider store={fakeStore}>
            <DefinitionTester
              definitions={formConfig.defaultDefinitions}
              schema={schema}
              data={{
                phoneAndEmail: {
                  primaryPhone: '1231231231',
                  emailAddress: 'a@b.co',
                },
                mailingAddress: {
                  'view:livesOnMilitaryBase': false,
                  country: 'USA',
                  addressLine1: '123 Main St',
                  addressLine2: 'Apartment Number 12345678',
                  city: 'Anytown',
                  state: 'MI',
                  zipCode: '12345',
                },
              }}
              formData={{}}
              uiSchema={uiSchema}
            />
          </Provider>,
        );

        const mailingSection = form.find('.review-card');
        const mailingCard = mailingSection.at(1);
        expect(mailingCard.find('.input-section').length).to.be.greaterThan(0);

        form.unmount();
      });
    });
  });
});
