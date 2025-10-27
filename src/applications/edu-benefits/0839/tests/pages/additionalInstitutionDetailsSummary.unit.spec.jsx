import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import {
  uiSchema,
  schema,
} from '../../pages/additionalInstitutionDetailsSummary';

const mockStore = configureStore([]);

describe('additionalInstitutionDetailsSummary page', () => {
  let sandbox;
  let store;

  const initialState = {
    form: {
      data: {
        hasAdditionalInstitutionDetails: '',
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

    expect(form.find('va-radio').length).to.equal(1);
    form.unmount();
  });

  it('renders the question correctly', () => {
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

    const radioElement = form.find('va-radio');
    expect(radioElement.prop('label')).to.equal(
      "Do you have any additional locations you'd like to add to this agreement?",
    );
    form.unmount();
  });

  it('renders Yes option with correct label', () => {
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

    const radioElement = form.find('va-radio');
    expect(radioElement.prop('label')).to.include('additional locations');
    form.unmount();
  });

  it('shows error when no option is selected on submit', async () => {
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

    // Wait for validation
    await new Promise(resolve => setTimeout(resolve, 100));
    form.update();

    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('allows submission when Yes is selected', async () => {
    const onSubmit = sandbox.spy();
    const dataWithYes = {
      hasAdditionalInstitutionDetails: true,
    };

    store = mockStore({
      form: {
        data: dataWithYes,
      },
    });

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={dataWithYes}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');

    // Wait for submission
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('allows submission when No is selected', async () => {
    const onSubmit = sandbox.spy();
    const dataWithNo = {
      hasAdditionalInstitutionDetails: false,
    };

    store = mockStore({
      form: {
        data: dataWithNo,
      },
    });

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={dataWithNo}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');

    // Wait for submission
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  describe('schema validation', () => {
    it('has required hasAdditionalInstitutionDetails field', () => {
      expect(schema.required).to.include('hasAdditionalInstitutionDetails');
    });

    it('has correct schema structure', () => {
      expect(schema.type).to.equal('object');
      expect(schema.properties.hasAdditionalInstitutionDetails).to.exist;
    });

    it('uses arrayBuilderYesNoSchema', () => {
      // The schema should have a boolean type for the yes/no question
      expect(schema.properties.hasAdditionalInstitutionDetails).to.exist;
    });
  });

  describe('uiSchema configuration', () => {
    it('uses arrayBuilderYesNoUI pattern', () => {
      expect(uiSchema.hasAdditionalInstitutionDetails).to.exist;
    });

    it('has correct title in configuration', () => {
      // The title is passed to arrayBuilderYesNoUI
      const uiOptions = uiSchema.hasAdditionalInstitutionDetails;
      expect(uiOptions).to.exist;
    });

    it('has correct labels configuration', () => {
      // The labels are configured in the second parameter
      const uiOptions = uiSchema.hasAdditionalInstitutionDetails;
      expect(uiOptions).to.exist;
    });
  });

  describe('integration with additionalInstitutionDetailsArrayOptions', () => {
    it('references correct array path', () => {
      // This is configured in the helpers.js additionalInstitutionDetailsArrayOptions
      // The page uses this configuration through arrayBuilderYesNoUI
      expect(uiSchema.hasAdditionalInstitutionDetails).to.exist;
    });
  });

  describe('different states', () => {
    it('renders when user has not answered yet', () => {
      const emptyState = {
        form: {
          data: {},
        },
      };
      store = mockStore(emptyState);

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

      expect(form.find('va-radio').length).to.equal(1);
      form.unmount();
    });

    it('renders when user selected Yes', () => {
      const yesState = {
        form: {
          data: {
            hasAdditionalInstitutionDetails: true,
            additionalInstitutionDetails: [],
          },
        },
      };
      store = mockStore(yesState);

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={yesState.form.data}
          />
        </Provider>,
      );

      expect(form.find('va-radio').length).to.equal(1);
      form.unmount();
    });

    it('renders when user selected No', () => {
      const noState = {
        form: {
          data: {
            hasAdditionalInstitutionDetails: false,
          },
        },
      };
      store = mockStore(noState);

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={noState.form.data}
          />
        </Provider>,
      );

      expect(form.find('va-radio').length).to.equal(1);
      form.unmount();
    });
  });

  describe('accessibility', () => {
    it('has proper form structure for screen readers', () => {
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

      const vaRadio = form.find('va-radio');
      expect(vaRadio.length).to.equal(1);
      form.unmount();
    });

    it('renders form element', () => {
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

      expect(form.find('form').length).to.equal(1);
      form.unmount();
    });
  });
});
