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

  const mainInstitution = {
    facilityCode: '12345678',
    institutionName: 'Main University',
    facilityMap: {
      branches: ['11111111', '22222222'],
      extensions: ['33333333', '44444444'],
    },
  };

  const initialState = {
    form: {
      data: {
        institutionDetails: mainInstitution,
        additionalInstitutionDetails: [
          {
            facilityCode: '',
          },
        ],
      },
    },
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    store = mockStore(initialState);
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '/0' },
    });
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

  describe('facilityCodeUIValidation', () => {
    it('does not show validation errors while loading', () => {
      const loadingState = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                isLoading: true,
              },
            ],
          },
        },
      };
      store = mockStore(loadingState);

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={loadingState.form.data.additionalInstitutionDetails[0]}
          />
        </Provider>,
      );

      expect(form.find('.usa-input-error').length).to.equal(0);
      form.unmount();
    });

    it('shows error for bad format facility code', async () => {
      const badFormatState = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '1234',
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(badFormatState);

      const onSubmit = sandbox.spy();
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={badFormatState.form.data.additionalInstitutionDetails[0]}
            onSubmit={onSubmit}
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

    it('shows error when institution not found', async () => {
      const notFoundState = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '12345678',
                institutionName: 'not found',
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(notFoundState);

      const onSubmit = sandbox.spy();
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={notFoundState.form.data.additionalInstitutionDetails[0]}
            onSubmit={onSubmit}
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

    it('shows error when facility code has X in third position', async () => {
      const hasXState = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '12X45678',
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(hasXState);

      const onSubmit = sandbox.spy();
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={hasXState.form.data.additionalInstitutionDetails[0]}
            onSubmit={onSubmit}
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

    it('shows error when code is not in branches or extensions', async () => {
      const notLinkedState = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '99999999',
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(notLinkedState);

      const onSubmit = sandbox.spy();
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={notLinkedState.form.data.additionalInstitutionDetails[0]}
            onSubmit={onSubmit}
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

    it('shows error when institution is not YR eligible', async () => {
      const notYRState = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                yrEligible: false,
                ihlEligible: true,
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(notYRState);

      const onSubmit = sandbox.spy();
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={notYRState.form.data.additionalInstitutionDetails[0]}
            onSubmit={onSubmit}
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

    it('shows error when institution is not IHL eligible', async () => {
      const notIHLState = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                yrEligible: true,
                ihlEligible: false,
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(notIHLState);

      const onSubmit = sandbox.spy();
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={notIHLState.form.data.additionalInstitutionDetails[0]}
            onSubmit={onSubmit}
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

    it('allows submission with valid facility code from branches', async () => {
      const validState = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                institutionName: 'Branch Campus',
                yrEligible: true,
                ihlEligible: true,
                isLoading: false,
                institutionAddress: {
                  street: '123 Main St',
                  city: 'Boston',
                  state: 'MA',
                  postalCode: '02101',
                  country: 'USA',
                },
              },
            ],
          },
        },
      };
      store = mockStore(validState);

      const onSubmit = sandbox.spy();
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={{
              ...validState.form.data.additionalInstitutionDetails[0],
              institutionDetails: validState.form.data.institutionDetails,
            }}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      form.find('form').simulate('submit');
      await waitFor(() => {
        expect(onSubmit.called).to.be.true;
      });
      form.unmount();
    });

    it('allows submission with valid facility code from extensions', async () => {
      const validState = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '33333333',
                institutionName: 'Extension Campus',
                yrEligible: true,
                ihlEligible: true,
                isLoading: false,
                institutionAddress: {
                  street: '456 Oak Ave',
                  city: 'Cambridge',
                  state: 'MA',
                  postalCode: '02138',
                  country: 'USA',
                },
              },
            ],
          },
        },
      };
      store = mockStore(validState);

      const onSubmit = sandbox.spy();
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={{
              ...validState.form.data.additionalInstitutionDetails[0],
              institutionDetails: validState.form.data.institutionDetails,
            }}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      form.find('form').simulate('submit');
      await waitFor(() => {
        expect(onSubmit.called).to.be.true;
      });
      form.unmount();
    });
  });

  describe('custom fields', () => {
    it('renders InstitutionName custom field', () => {
      const validState = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                institutionName: 'Branch Campus',
              },
            ],
          },
        },
      };
      store = mockStore(validState);

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={validState.form.data.additionalInstitutionDetails[0]}
          />
        </Provider>,
      );

      expect(form.find('InstitutionName').length).to.equal(1);
      form.unmount();
    });

    it('renders InstitutionAddress custom field', () => {
      const validState = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                institutionAddress: {
                  street: '123 Main St',
                  city: 'Boston',
                  state: 'MA',
                  postalCode: '02101',
                  country: 'USA',
                },
              },
            ],
          },
        },
      };
      store = mockStore(validState);

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={validState.form.data.additionalInstitutionDetails[0]}
          />
        </Provider>,
      );

      expect(form.find('InstitutionAddress').length).to.equal(1);
      form.unmount();
    });

    it('renders WarningBanner custom field', () => {
      const validState = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '99999999',
                yrEligible: false,
                ihlEligible: true,
              },
            ],
          },
        },
      };
      store = mockStore(validState);

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={validState.form.data.additionalInstitutionDetails[0]}
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
  });

  describe('ui:options', () => {
    it('sets correct options for InstitutionName field', () => {
      const institutionNameOptions = uiSchema.institutionName['ui:options'];
      expect(institutionNameOptions.dataPath).to.equal(
        'additionalInstitutionDetails',
      );
      expect(institutionNameOptions.isArrayItem).to.be.true;
    });

    it('sets correct options for InstitutionAddress field', () => {
      const institutionAddressOptions =
        uiSchema.institutionAddress['ui:options'];
      expect(institutionAddressOptions.dataPath).to.equal(
        'additionalInstitutionDetails',
      );
      expect(institutionAddressOptions.isArrayItem).to.be.true;
      expect(institutionAddressOptions.hideLabelText).to.be.true;
    });

    it('sets correct options for WarningBanner field', () => {
      const warningBannerOptions = uiSchema['view:warningBanner']['ui:options'];
      expect(warningBannerOptions.dataPath).to.equal(
        'additionalInstitutionDetails',
      );
      expect(warningBannerOptions.isArrayItem).to.be.true;
    });
  });
});
