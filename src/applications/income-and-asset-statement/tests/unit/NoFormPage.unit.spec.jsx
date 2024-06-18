import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { NoFormPage } from '../../components/NoFormPage';

const mockStore = configureStore([]);

describe('No Form Page', () => {
  it('should render', async () => {
    const store = mockStore({
      user: { login: { currentlyLoggedIn: true } },
    });
    const { container } = render(
      <Provider store={store}>
        <NoFormPage />
      </Provider>,
    );
    await waitFor(() => {
      expect($('h1', container).textContent).to.eql(
        '21P-0969 Income and Asset Statement Form',
      );
      expect($$('p', container)[0].textContent).to.eql(
        'Please check back later.',
      );
    });
  });
});
