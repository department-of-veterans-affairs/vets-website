import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';

import formConfig from '../../config/form';
import ConfirmationPage from '../../containers/ConfirmationPage';
import * as maximalJson from '../fixtures/data/maximal-test.json';

const mockStore = state => createStore(() => state);

before(() => {
  if (!global.scrollTo) global.scrollTo = () => {};
});

const getPage = submission =>
  render(
    <Provider
      store={mockStore({
        form: {
          ...createInitialState(formConfig),
          submission,
          data: { ...maximalJson.data },
        },
      })}
    >
      <ConfirmationPage route={{ formConfig }} />
    </Provider>,
  );

describe('<ConfirmationPage />', () => {
  afterEach(cleanup);

  it('shows success alert', () => {
    const { container } = getPage({
      response: {
        attributes: { confirmationNumber: '1234567890' },
      },
      timestamp: new Date(2025, 7, 1),
    });

    const successAlert = container.querySelector('va-alert');

    expect(successAlert).to.have.attribute('status', 'success');
    // Submission Date
    expect(successAlert.innerHTML).to.include('August 1, 2025');
    // Confirmation Number
    expect(successAlert.innerHTML).to.include('1234567890');
  });

  it('shows save pdf section if response provides pdfUrl', () => {
    const { container } = getPage({
      response: { confirmationNumber: '1234567890', pdfUrl: '10297-download' },
      timestamp: new Date(2025, 7, 1),
    });
    const savePdfSection = container.querySelector(
      'div[class^="confirmation-save-pdf-download-section"]',
    );

    expect(savePdfSection).to.exist;
    expect(savePdfSection.querySelector('va-link[filetype="PDF"]')).to.exist;
  });

  it('shows the chapter section collection/summary accordion', () => {
    const { container } = getPage({
      response: { confirmationNumber: '1234567890' },
      timestamp: new Date().toISOString(),
    });
    const accordion = container.querySelector('va-accordion');

    expect(accordion).to.exist;
    expect(accordion.querySelectorAll('va-accordion-item').length).to.equal(1);
  });

  it('shows button to print page', () => {
    const { container } = getPage({
      response: { confirmationNumber: '1234567890' },
      timestamp: new Date().toISOString(),
    });
    const printSection = container.querySelector(
      'div[class^="confirmation-print-this-page-section"]',
    );

    expect(printSection).to.exist;
    expect(printSection.querySelector('va-button')).to.have.attribute(
      'text',
      'Print this page for your records',
    );
  });

  it('shows process list section', () => {
    const { container } = getPage({
      response: { confirmationNumber: '1234567890' },
      timestamp: new Date().toISOString(),
    });

    expect(container.querySelector('va-process-list')).to.exist;
    expect(container.querySelectorAll('va-process-list-item').length).to.equal(
      3,
    );
  });

  it('shows how to contact section with link', () => {
    const { container } = getPage({
      response: { confirmationNumber: '1234567890' },
      timestamp: new Date().toISOString(),
    });
    const contactSection = container.querySelector(
      'div[class="confirmation-how-to-contact-section"]',
    );

    expect(contactSection).to.exist;
    expect(contactSection.querySelector('va-link[text="Ask VA"]')).to.exist;
  });

  it('shows action link to return to VA.gov homepage', () => {
    const { container } = getPage({
      response: { confirmationNumber: '1234567890' },
      timestamp: new Date().toISOString(),
    });

    expect(container.querySelector('va-link-action')).to.have.attribute(
      'text',
      'Go back to VA.gov homepage',
    );
  });

  it('renders safely when submission object is empty (defaults kick in)', () => {
    const { container, queryByText } = getPage({});

    expect(container.querySelector('va-alert')).to.have.attribute(
      'status',
      'success',
    );

    expect(queryByText('Your confirmation number is')).to.be.null;
  });
});
