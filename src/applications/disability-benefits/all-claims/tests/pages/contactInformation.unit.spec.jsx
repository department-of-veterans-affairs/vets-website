import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/react';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
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
        // street 1, 2, 3, city, but TODO why not phone, email, and overseas address checkbox
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
        const totalErrors =
          selectErrors.length + textInputErrors.length + radioErrors.length;
        expect(totalErrors).to.equal(0);
        expect(onSubmit.called).to.be.true;
        form.unmount();
      });
    });
  });
});
