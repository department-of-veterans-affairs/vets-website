import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '../../config/form';
import ConfirmationPage from '../../containers/ConfirmationPage';

const mockStore = state => createStore(() => state);

const getPage = (submission = {}) =>
  render(
    <Provider
      store={mockStore({
        form: {
          ...createInitialState(formConfig),
          submission,
          data: {},
        },
      })}
    >
      <ConfirmationPage route={{ formConfig }} />
    </Provider>,
  );

describe('ConfirmationPage', () => {
  afterEach(cleanup);

  it('renders confirmation number when present', () => {
    const { container } = getPage({
      response: {
        attributes: { confirmationNumber: '1234567890' },
      },
      timestamp: new Date().toISOString(),
    });

    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'success');
    expect(alert).to.contain.text('Your confirmation number is 1234567890');
  });
});
