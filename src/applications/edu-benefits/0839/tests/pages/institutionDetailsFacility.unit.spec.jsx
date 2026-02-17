import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { uiSchema, schema } from '../../pages/institutionDetailsFacility';

const mockStore = configureStore([]);

describe('institutionDetailsFacility page', () => {
  let sandbox;
  let store;

  const initialState = {
    form: {
      data: {
        institutionDetails: {
          facilityCode: '',
        },
      },
    },
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    store = mockStore(initialState);
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
      "Please enter your institution's facility code",
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
  it('does not hide additional instructions link when not withdrawal', () => {
    const { hideIf } = uiSchema.institutionDetails[
      'view:additionalInstructions'
    ]['ui:options'];

    expect(hideIf({ agreementType: 'addToYellowRibbonProgram' })).to.equal(
      false,
    );
    expect(hideIf({})).to.equal(false);
  });

  it('hides additional instructions link when agreementType is withdrawal', () => {
    const { hideIf } = uiSchema.institutionDetails[
      'view:additionalInstructions'
    ]['ui:options'];

    expect(
      hideIf({ agreementType: 'withdrawFromYellowRibbonProgram' }),
    ).to.equal(true);
  });

  it('does not render additional instructions link when agreementType is withdrawal', () => {
    const withdrawState = {
      form: {
        data: {
          agreementType: 'withdrawFromYellowRibbonProgram',
          institutionDetails: { facilityCode: '' },
        },
      },
    };
    store = mockStore(withdrawState);

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={withdrawState.form.data}
        />
      </Provider>,
    );

    expect(form.text()).to.not.include(
      'Review additional instructions for the Yellow Ribbon Program Agreement',
    );
    expect(
      form.find('va-link').filterWhere(n => {
        const props = n.props() || {};
        return (
          props.text ===
          'Review additional instructions for the Yellow Ribbon Program Agreement'
        );
      }).length,
    ).to.equal(0);

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
      'va-text-input[name="root_institutionDetails_facilityCode"]',
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
        'va-text-input[name="root_institutionDetails_facilityCode"]',
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
            institutionDetails: {
              facilityCode: '12345678',
              isLoading: true,
            },
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
            data={loadingState.form.data}
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
            institutionDetails: {
              facilityCode: '1234',
              isLoading: false,
            },
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
            data={badFormatState.form.data}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      form.find('form').simulate('submit');
      await waitFor(() => {
        form.update();
        const facilityCodeInput = form.find(
          'va-text-input[name="root_institutionDetails_facilityCode"]',
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
            institutionDetails: {
              facilityCode: '12345678',
              institutionName: 'not found',
              isLoading: false,
            },
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
            data={notFoundState.form.data}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      form.find('form').simulate('submit');
      await waitFor(() => {
        form.update();
        const facilityCodeInput = form.find(
          'va-text-input[name="root_institutionDetails_facilityCode"]',
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
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: false,
              ihlEligible: true,
              isLoading: false,
            },
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
            data={notYRState.form.data}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      form.find('form').simulate('submit');
      await waitFor(() => {
        form.update();
        const facilityCodeInput = form.find(
          'va-text-input[name="root_institutionDetails_facilityCode"]',
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
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: true,
              ihlEligible: false,
              isLoading: false,
            },
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
            data={notIHLState.form.data}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      form.find('form').simulate('submit');
      await waitFor(() => {
        form.update();
        const facilityCodeInput = form.find(
          'va-text-input[name="root_institutionDetails_facilityCode"]',
        );
        expect(facilityCodeInput.length).to.be.at.least(1);
      });
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });

    it('allows submission with valid facility code and eligible institution', async () => {
      const validState = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              institutionName: 'Harvard University',
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
            data={validState.form.data}
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
            institutionDetails: {
              facilityCode: '12345678',
              institutionName: 'Harvard University',
            },
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
            data={validState.form.data}
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
            institutionDetails: {
              facilityCode: '12345678',
              institutionAddress: {
                street: '123 Main St',
                city: 'Boston',
                state: 'MA',
                postalCode: '02101',
                country: 'USA',
              },
            },
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
            data={validState.form.data}
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
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: false,
              ihlEligible: true,
            },
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
            data={validState.form.data}
          />
        </Provider>,
      );

      expect(form.find('WarningBanner').length).to.equal(1);
      form.unmount();
    });
  });

  describe('schema validation', () => {
    it('has required facilityCode field', () => {
      expect(schema.properties.institutionDetails.required).to.include(
        'facilityCode',
      );
    });

    it('has correct schema structure', () => {
      expect(schema.type).to.equal('object');
      expect(schema.properties.institutionDetails).to.exist;
      expect(schema.properties.institutionDetails.properties.facilityCode).to
        .exist;
      expect(schema.properties.institutionDetails.properties.institutionAddress)
        .to.exist;
    });

    it('has required address fields', () => {
      const addressSchema =
        schema.properties.institutionDetails.properties.institutionAddress;

      expect(addressSchema.required).to.include('street');
      expect(addressSchema.required).to.include('city');
      expect(addressSchema.required).to.include('state');
      expect(addressSchema.required).to.include('postalCode');
      expect(addressSchema.required).to.include('country');
    });
  });

  describe('ui:options', () => {
    it('sets correct options for InstitutionName field', () => {
      const institutionNameOptions =
        uiSchema.institutionDetails.institutionName['ui:options'];
      expect(institutionNameOptions.dataPath).to.equal('institutionDetails');
      expect(institutionNameOptions.isArrayItem).to.be.false;
    });

    it('sets correct options for InstitutionAddress field', () => {
      const institutionAddressOptions =
        uiSchema.institutionDetails.institutionAddress['ui:options'];
      expect(institutionAddressOptions.dataPath).to.equal('institutionDetails');
      expect(institutionAddressOptions.isArrayItem).to.be.false;
      expect(institutionAddressOptions.hideLabelText).to.be.true;
    });

    it('sets correct options for WarningBanner field', () => {
      const warningBannerOptions =
        uiSchema.institutionDetails['view:warningBanner']['ui:options'];
      expect(warningBannerOptions.dataPath).to.equal('institutionDetails');
      expect(warningBannerOptions.isArrayItem).to.be.false;
    });
  });
});
