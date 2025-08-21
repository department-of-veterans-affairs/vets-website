import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import {
  getFormDOM,
  DefinitionTester,
} from 'platform/testing/unit/schemaform-utils.jsx';
import configureMockStore from 'redux-mock-store';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

const mockStore = configureMockStore();

const payload = {
  claimant: {
    hasCurrentlyBuried: '1',
  },
};

const store = mockStore({
  form: {
    data: payload,
  },
});

describe('Pre-need preparer info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.preparerInformation.pages.preparerContactDetails;

  it('should render contact details', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <div>
        <Provider store={store}>
          <DefinitionTester
            schema={schema}
            data={{}}
            definitions={formConfig.defaultDefinitions}
            uiSchema={uiSchema}
          />
        </Provider>
      </div>,
    );

    const formDOM = getFormDOM(form);
    formDOM.fillData(
      '#root_application_applicant_view\\:applicantInfo_mailingAddress_country',
      'USA',
    );

    expect($$('input', formDOM).length).to.equal(6);
    expect($$('select', formDOM).length).to.equal(2);
  });

  it('should render contact details', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <div>
        <Provider store={store}>
          <DefinitionTester
            schema={schema}
            data={{}}
            definitions={formConfig.defaultDefinitions}
            uiSchema={uiSchema}
          />
        </Provider>
      </div>,
    );

    const formDOM = getFormDOM(form);
    formDOM.fillData(
      '#root_application_applicant_view\\:applicantInfo_mailingAddress_country',
      'MEX',
    );

    expect($$('input', formDOM).length).to.equal(6);
    expect($$('select', formDOM).length).to.equal(1);
  });
});
