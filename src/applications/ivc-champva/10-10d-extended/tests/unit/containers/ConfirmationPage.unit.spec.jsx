import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '../../../config/form';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import mockData from '../../e2e/fixtures/data/maximal-test.json';

const mockStore = state => createStore(() => state);

const initConfirmationPage = ({ formData } = {}) => {
  const store = mockStore({
    form: {
      ...createInitialState(formConfig),
      submission: {
        response: {
          confirmationNumber: '1234567890',
        },
        timestamp: new Date(),
      },
      data: { ...formData, statementOfTruthSignature: 'Lorem ipsum' },
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

  it('should render', () => {
    const { container } = initConfirmationPage({ formData: mockData });
    expect(container).to.exist;
  });

  it('should gracefully handle missing props', () => {
    // Rather than using initConfirmationPages(), which includes
    // a submission, response, etc, just instantiate it with nothing
    const minimalStore = mockStore({
      form: {
        data: {},
      },
    });
    const { container } = render(
      <Provider store={minimalStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(container).to.exist;
  });

  it('should show success alert, h2, and confirmation number if present', () => {
    const { container } = initConfirmationPage({ formData: mockData });
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'success');
    expect(alert.querySelector('h2')).to.contain.text("You've submitted");
  });
});
