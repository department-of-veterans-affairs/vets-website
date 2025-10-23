import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import NextStepsPage from '../../containers/NextStepsPage';
import mockFormData from '../fixtures/data/21-22a/form-data.json';

describe('<NextStepsPage />', () => {
  const mockStore = configureMockStore();

  it('renders the component with mocked Redux store', () => {
    const store = mockStore({
      form: {
        data: mockFormData,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <NextStepsPage />
      </Provider>,
    );

    expect($('h1', container).textContent).to.eq(
      'Request help from a VA accredited representative or VSO',
    );
    expect($('h2', container).textContent).to.eq('Your next steps');
  });
});
