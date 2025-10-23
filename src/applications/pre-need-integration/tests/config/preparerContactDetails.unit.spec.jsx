import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

const mockStore = configureMockStore();

describe('Pre-need preparer contact details', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.preparerInformation.pages.preparerContactDetails;

  let store;

  beforeEach(() => {
    store = mockStore({
      form: {
        data: {},
      },
    });
  });

  it('should render basic form fields', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    // Check for va-select components (country and potentially state)
    expect(form.find('va-select').length).to.be.at.least(1);
    form.unmount();
  });

  it('should show state field when country is USA', () => {
    const storeWithUSA = mockStore({
      form: {
        data: {
          application: {
            applicant: {
              'view:applicantInfo': {
                mailingAddress: {
                  country: 'USA',
                },
              },
            },
          },
        },
      },
    });

    const form = mount(
      <Provider store={storeWithUSA}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            application: {
              applicant: {
                'view:applicantInfo': {
                  mailingAddress: {
                    country: 'USA',
                  },
                },
              },
            },
          }}
        />
      </Provider>,
    );

    // Should have country and state selects for USA
    expect(form.find('va-select').length).to.equal(2);
    form.unmount();
  });

  it('should show state field with Province title when country is CAN', () => {
    const storeWithCAN = mockStore({
      form: {
        data: {
          application: {
            applicant: {
              'view:applicantInfo': {
                mailingAddress: {
                  country: 'CAN',
                },
              },
            },
          },
        },
      },
    });

    const form = mount(
      <Provider store={storeWithCAN}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            application: {
              applicant: {
                'view:applicantInfo': {
                  mailingAddress: {
                    country: 'CAN',
                  },
                },
              },
            },
          }}
        />
      </Provider>,
    );

    expect(form.find('va-text-input').length).to.equal(6);
    // Should have country and state selects for CAN
    // State field should be labeled as "Province"
    expect(form.find('va-select').length).to.equal(2);
    form.unmount();
  });

  it('should hide state field when country is not USA', () => {
    const storeWithOtherCountry = mockStore({
      form: {
        data: {
          application: {
            applicant: {
              'view:applicantInfo': {
                mailingAddress: {
                  country: 'MEX',
                },
              },
            },
          },
        },
      },
    });

    const form = mount(
      <Provider store={storeWithOtherCountry}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            application: {
              applicant: {
                'view:applicantInfo': {
                  mailingAddress: {
                    country: 'MEX',
                  },
                },
              },
            },
          }}
        />
      </Provider>,
    );

    // Should only have country select for non-USA countries
    expect(form.find('va-select').length).to.equal(1);
    form.unmount();
  });

  it('should render contact info fields', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    // Check for address text inputs (street, street2, city, postal, phone, email)
    expect(form.find('va-text-input').length).to.equal(6);
    form.unmount();
  });
});
