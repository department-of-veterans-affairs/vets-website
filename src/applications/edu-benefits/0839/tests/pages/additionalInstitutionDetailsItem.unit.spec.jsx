import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { uiSchema, schema } from '../../pages/additionalInstitutionDetailsItem';

const mockStore = configureStore([]);

describe('additionalInstitutionDetailsItem page', () => {
  let sandbox;
  let store;

  const createInitialState = (data = {}) => ({
    form: {
      data: {
        institutionDetails: {
          facilityCode: '12345678',
          facilityMap: {
            branches: [
              { institution: { facilityCode: 'ABCD1234' } },
              { institution: { facilityCode: 'EFGH5678' } },
            ],
            extensions: [
              { institution: { facilityCode: 'IJKL9012' } },
              { institution: { facilityCode: 'MNOP3456' } },
            ],
          },
        },
        additionalInstitutionDetails: [],
        ...data,
      },
    },
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    store = mockStore(createInitialState());
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders the page', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect(form.find('va-text-input').length).to.equal(1);
    form.unmount();
  });

  it('renders title correctly', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect(form.text()).to.include(
      "Enter the VA facility code for the additional location you'd like to add",
    );
    form.unmount();
  });

  it('renders additional instructions link', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect(form.find('va-link').length).to.be.at.least(1);
    expect(form.find('va-link').prop('text')).to.include(
      'Review additional instructions',
    );
    form.unmount();
  });

  it('renders facility code input field', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    const facilityCodeInput = form.find(
      'va-text-input[name="root_facilityCode"]',
    );
    expect(facilityCodeInput.length).to.equal(1);
    form.unmount();
  });

  it('shows error when facility code is not provided', async () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={{}}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    await waitFor(() => {
      form.update();
      const facilityCodeInput = form.find(
        'va-text-input[name="root_facilityCode"]',
      );
      expect(facilityCodeInput.length).to.be.at.least(1);
    });
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  describe('custom fields', () => {
    it('renders AdditionalInstitutionName custom field', () => {
      const validState = {
        institutionDetails: {
          facilityCode: '12345678',
          facilityMap: {
            branches: [{ institution: { facilityCode: 'ABCD1234' } }],
            extensions: [],
          },
        },
        additionalInstitutionDetails: [
          {
            facilityCode: 'ABCD1234',
            institutionName: 'Harvard University',
          },
        ],
      };
      store = mockStore(createInitialState(validState));

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={validState}
          />
        </Provider>,
      );

      expect(form.find('AdditionalInstitutionName').length).to.equal(1);
      form.unmount();
    });

    it('renders AdditionalInstitutionAddress custom field', () => {
      const validState = {
        institutionDetails: {
          facilityCode: '12345678',
          facilityMap: {
            branches: [{ institution: { facilityCode: 'ABCD1234' } }],
            extensions: [],
          },
        },
        additionalInstitutionDetails: [
          {
            facilityCode: 'ABCD1234',
            institutionAddress: {
              street: '123 Main St',
              city: 'Boston',
              state: 'MA',
              postalCode: '02101',
              country: 'USA',
            },
          },
        ],
      };
      store = mockStore(createInitialState(validState));

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={validState}
          />
        </Provider>,
      );

      expect(form.find('AdditionalInstitutionAddress').length).to.equal(1);
      form.unmount();
    });

    it('renders WarningBanner custom field', () => {
      const validState = {
        institutionDetails: {
          facilityCode: '12345678',
          facilityMap: {
            branches: [{ institution: { facilityCode: 'ABCD1234' } }],
            extensions: [],
          },
        },
        additionalInstitutionDetails: [
          {
            facilityCode: 'ABCD1234',
            yrEligible: false,
            ihlEligible: true,
          },
        ],
      };
      store = mockStore(createInitialState(validState));

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={validState}
          />
        </Provider>,
      );

      expect(form.find('WarningBanner').length).to.equal(1);
      form.unmount();
    });
  });

  describe('schema validation', () => {
    it('has required facilityCode field', () => {
      expect(schema.required).to.include('facilityCode');
    });

    it('has correct schema structure', () => {
      expect(schema.type).to.equal('object');
      expect(schema.properties.facilityCode).to.exist;
      expect(schema.properties.institutionAddress).to.exist;
    });

    it('has required address fields', () => {
      const addressSchema = schema.properties.institutionAddress;
      expect(addressSchema.required).to.include('street');
      expect(addressSchema.required).to.include('city');
      expect(addressSchema.required).to.include('state');
      expect(addressSchema.required).to.include('postalCode');
      expect(addressSchema.required).to.include('country');
    });

    it('has correct institutionName schema', () => {
      expect(schema.properties.institutionName.type).to.equal('string');
    });

    it('has view:additionalInstructions in schema', () => {
      expect(schema.properties['view:additionalInstructions']).to.exist;
      expect(schema.properties['view:additionalInstructions'].type).to.equal(
        'object',
      );
    });

    it('has view:warningBanner in schema', () => {
      expect(schema.properties['view:warningBanner']).to.exist;
      expect(schema.properties['view:warningBanner'].type).to.equal('object');
    });
  });

  describe('ui:options', () => {
    it('sets correct options for InstitutionName field', () => {
      const institutionNameOptions = uiSchema.institutionName['ui:options'];
      expect(institutionNameOptions.dataPath).to.equal(
        'additionalInstitutionDetails',
      );
      expect(institutionNameOptions.isArrayItem).to.be.true;
    });

    it('sets correct options for WarningBanner field', () => {
      const warningBannerOptions = uiSchema['view:warningBanner']['ui:options'];
      expect(warningBannerOptions.dataPath).to.equal(
        'additionalInstitutionDetails',
      );
      expect(warningBannerOptions.isArrayItem).to.be.true;
    });
  });

  describe('uiSchema error messages', () => {
    it('has custom error message for required facilityCode', () => {
      const facilityCodeErrorMessages =
        uiSchema.facilityCode['ui:errorMessages'];
      expect(facilityCodeErrorMessages.required).to.include(
        'Please enter a valid 8-character facility code',
      );
    });
  });
});
