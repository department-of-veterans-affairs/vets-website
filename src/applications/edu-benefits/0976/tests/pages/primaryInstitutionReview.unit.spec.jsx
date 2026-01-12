import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/primaryInstitutionReview';
import formConfig from '../../config/form';

const mockStore = configureStore([]);

const renderPage = (storeData = {}) => {
  const store = mockStore(storeData);
  return render(
    <Provider store={store}>
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={page.schema}
        uiSchema={page.uiSchema}
        data={storeData.form.data}
      />
    </Provider>,
  );
};

describe('22-0976 primary institution review page', () => {
  it('renders the institution information', () => {
    const { getByText } = renderPage({
      form: {
        data: {
          primaryInstitutionDetails: {
            name: 'Test University',
            type: 'PUBLIC',
            mailingAddress: {
              street: '123 Fake St.',
              street2: 'Unit B',
              city: 'Tulsa',
              state: 'OK',
              postalCode: '12345',
            },
          },
        },
      },
    });

    expect(getByText('Review your institution details')).to.exist;
    expect(getByText('Test University')).to.exist;
    expect(getByText('123 Fake St.')).to.exist;
    expect(getByText('Tulsa, OK 12345')).to.exist;
  });

  it('renders nothing when no primary institution is present', () => {
    const { getByText } = renderPage({
      form: {
        data: {
          primaryInstitutionDetails: null,
        },
      },
    });

    expect(getByText('Review your institution details')).to.exist;
  });
});
