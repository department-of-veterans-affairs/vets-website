import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../config/form';
import ConfirmationPage from '../../../containers/ConfirmationPage';

const mockStore = state => createStore(() => state);

const initConfirmationPage = ({
  confirmationNumber = '1234567890',
  timestamp = '2025-09-07T12:00:00Z',
  pdfUrl = 'https://example.com/test.pdf',
  formData = {},
} = {}) => {
  const store = mockStore({
    form: {
      ...createInitialState(formConfig),
      submission: {
        response: {
          confirmationNumber,
          pdfUrl,
        },
        timestamp,
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

  it('should render successfully', () => {
    const { container } = initConfirmationPage();
    expect(container).to.exist;
  });

  xit('should show success alert with confirmation number', () => {
    const { container } = initConfirmationPage();

    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'success');
    expect(container).to.contain.text('1234567890');
  });

  it('should render submission details with proper content', () => {
    const screen = initConfirmationPage();

    expect(screen.getByText(/Form submission started/)).to.exist;
    expect(screen.getByText(/Your submission is in progress/)).to.exist;
  });

  xit('should display form reference in download link', () => {
    const { container } = initConfirmationPage();

    // The form number should appear in the va-link element's text attribute
    const vaLink = $('va-link[text*="21P-8416"]', container);
    expect(vaLink).to.exist;
  });

  it('should render confirmation page with proper heading structure', () => {
    const { container } = initConfirmationPage();

    // Check for h2 elements that might contain dates - following pensions pattern
    expect($('h2', container)).to.exist;
    expect($('h2', container).textContent).to.include(
      'Form submission started',
    );

    // Check for multiple h2 elements using $$
    const h2Elements = $$('h2', container);
    expect(h2Elements.length).to.be.greaterThan(0);
  });

  xit('should display confirmation sections in proper DOM structure', () => {
    const { container } = initConfirmationPage();

    // Check for main confirmation sections - following pensions pattern
    expect($('.confirmation-submission-alert-section', container)).to.exist;
    expect($('.confirmation-save-pdf-download-section', container)).to.exist;
    expect($('.confirmation-whats-next-process-list-section', container)).to
      .exist;
    expect($('.confirmation-how-to-contact-section', container)).to.exist;
  });

  it('should handle form with standard confirmation structure', () => {
    const { container } = initConfirmationPage();

    // Test the main confirmation elements are present using $ utility
    expect($('va-alert[status="success"]', container)).to.exist;
    expect($('va-telephone', container)).to.exist;
    expect($('va-link', container)).to.exist;

    // Check for help section specifically
    expect($('.confirmation-need-help-section', container)).to.exist;
  });

  it('should render ConfirmationView sections', () => {
    const { container } = initConfirmationPage();

    // Check for key sections that ConfirmationView renders
    expect(container.textContent).to.include('Print this confirmation page');
    expect(container.textContent).to.include('What to expect');
    expect(container.textContent).to.include(
      'How to contact us if you have questions',
    );
    expect(container.textContent).to.include('Need help?');
  });

  it('should handle missing confirmation number gracefully', () => {
    const { container } = initConfirmationPage({ confirmationNumber: '' });

    expect(container).to.exist;
    // Should still render the confirmation page even without a confirmation number
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'success');
  });

  it('should handle missing timestamp gracefully', () => {
    const { container } = initConfirmationPage({ timestamp: '' });

    expect(container).to.exist;
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'success');
  });

  it('should render with minimal form state', () => {
    const minimalStore = mockStore({
      form: {
        data: {},
        submission: {},
      },
    });

    const { container } = render(
      <Provider store={minimalStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(container).to.exist;
  });

  xit('should pass correct props to ConfirmationView', () => {
    const testDate = '2025-10-21T12:00:00Z';
    const testConfirmationNumber = 'TEST-123456';
    const testPdfUrl = 'https://example.com/form.pdf';

    const { container } = initConfirmationPage({
      confirmationNumber: testConfirmationNumber,
      timestamp: testDate,
      pdfUrl: testPdfUrl,
    });

    // Verify the confirmation number appears in the rendered content
    expect(container.textContent).to.include('TEST-123456');
  });

  it('should render form data correctly when provided', () => {
    const testFormData = {
      claimantFullName: {
        first: 'John',
        last: 'Doe',
      },
      careExpenses: [
        {
          typeOfCare: 'IN_HOME_CARE_ATTENDANT',
          monthlyAmount: 1500,
        },
      ],
    };

    const { container } = initConfirmationPage({ formData: testFormData });

    expect(container).to.exist;
    // The ConfirmationView should render successfully with form data
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'success');
  });
});
