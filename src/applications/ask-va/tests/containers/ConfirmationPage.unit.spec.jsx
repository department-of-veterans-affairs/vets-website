import { expect } from 'chai';
import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import ConfirmationPage from '../../containers/ConfirmationPage';

import { getData } from '../fixtures/data/mock-form-data';

describe('Confirmation page', () => {
  it('should render', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage {...props} />
      </Provider>,
    );
    expect($('p', container).textContent).to.eq(
      'Your question was submitted successfully.',
    );
  });
});
