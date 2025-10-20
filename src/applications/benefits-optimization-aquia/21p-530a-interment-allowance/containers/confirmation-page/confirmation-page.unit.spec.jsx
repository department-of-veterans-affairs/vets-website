/**
 * @module tests/containers/confirmation-page.unit.spec
 * @description Unit tests for ConfirmationPage component
 */

import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '@bio-aquia/21p-530a-interment-allowance/config/form';
import { ConfirmationPage } from './confirmation-page';

const mockStore = state => createStore(() => state);

const initConfirmationPage = ({ formData } = {}) => {
  const store = mockStore({
    form: {
      ...createInitialState(formConfig),
      submission: {
        response: {
          confirmationNumber: 'JT87563-R2D2',
        },
        timestamp: new Date(),
      },
      data: formData,
    },
  });

  return render(
    <Provider store={store}>
      <ConfirmationPage route={{ formConfig }} />
    </Provider>,
  );
};

describe('ConfirmationPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('should show success alert, h2, and confirmation number if present', () => {
    const { container } = initConfirmationPage();
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'success');
    const heading = alert.querySelector('h2');
    expect(heading.textContent).to.include(
      'submitted your application for a burial allowance',
    );
    expect(container).to.contain.text('JT87563-R2D2');
  });
});
