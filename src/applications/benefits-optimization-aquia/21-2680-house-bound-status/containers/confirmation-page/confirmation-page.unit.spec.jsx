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
import {
  formConfig,
  ConfirmationPage,
} from '@bio-aquia/21-2680-house-bound-status';

const mockStore = state => createStore(() => state);

const initConfirmationPage = ({ formData } = {}) => {
  const store = mockStore({
    form: {
      ...createInitialState(formConfig),
      submission: {
        response: {
          attributes: {
            guid: '12345678-1234-1234-1234-123456789abc',
            confirmationNumber: 'HB12345-A1B2',
          },
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

  it('should show warning alert with additional steps message', () => {
    const { container } = initConfirmationPage();
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'warning');
    expect(container).to.contain.text('Additional steps are needed');
    expect(container).to.contain.text(
      'You completed your part of this application',
    );
  });
});
