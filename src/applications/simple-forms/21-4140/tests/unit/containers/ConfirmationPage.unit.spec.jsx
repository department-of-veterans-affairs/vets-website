import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '../../../config/form';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import maximalTestData from '../../fixtures/data/maximal-test.json';

const mockStore = state => createStore(() => state);

const initConfirmationPage = (
  { formData } = {},
  includeTimeStamp = true,
  includeSubmission = true,
) => {
  const store = mockStore({
    form: {
      ...createInitialState(formConfig),
      submission: includeSubmission
        ? {
            response: {
              confirmationNumber: includeTimeStamp ? '1234567890' : null,
              pdfUrl: null,
            },
            timestamp: includeTimeStamp ? new Date() : 'invalid!',
          }
        : null,
      data: formData || {},
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
    expect(alert.querySelector('h2')).to.contain.text(
      'Form submission started',
    );
    expect(alert).to.contain.text('Your confirmation number is 1234567890');
  });

  it('should render with form data', () => {
    const { container } = initConfirmationPage({
      formData: maximalTestData.data,
    });
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'success');
  });

  it('should handle missing confirmation number and timestamp', () => {
    const { container } = initConfirmationPage(
      {
        formData: maximalTestData.data,
      },
      false,
    );
    const alert = container.querySelector('va-alert');
    expect(alert.querySelector('h2').textContent).to.equal(
      'Form submission started',
    );
    expect(alert).not.to.contain.text('Your confirmation number is');
  });

  it('should handle when form is null', () => {
    const { getByText } = initConfirmationPage(
      {
        formData: maximalTestData.data,
      },
      false,
      false,
    );

    expect(getByText('Form submission started')).to.exist;
  });
});
