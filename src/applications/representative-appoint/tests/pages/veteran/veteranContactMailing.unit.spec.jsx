import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import configureStore from 'redux-mock-store';

import mockFormData from '../../fixtures/data/form-data.json';

import formConfig from '../../../config/form';

describe('Veteran Contact Mailing page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.claimantInfo.pages.veteranContactMailing;

  const mockStore = configureStore();
  const store = mockStore({
    user: { login: { currentlyLoggedIn: true } },
    form: { data: {} },
  });

  it.skip('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={mockFormData}
        formData={mockFormData}
      />,
    );

    expect(container.querySelector('button[type="submit"]')).to.exist;
  });

  it('should have proper max lengths for address fields', () => {
    const addressProps = schema.properties.veteranHomeAddress.properties;

    expect(addressProps.street.maxLength).to.equal(30);
    expect(addressProps.street2.maxLength).to.equal(5);
    expect(addressProps.city.maxLength).to.equal(18);
    expect(addressProps.state.maxLength).to.equal(2);
    expect(addressProps.postalCode.maxLength).to.equal(9);
  });

  it('should require state for non-US countries', () => {
    const formData = {
      veteranHomeAddress: { country: 'AND' },
    };

    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={formData}
        />
      </Provider>,
    );

    const stateProvinceField = container.querySelector(
      'va-text-input[name="root_veteranHomeAddress_state"]',
    );

    expect(stateProvinceField).to.exist;

    expect(stateProvinceField).to.have.attribute('required');
  });
});
