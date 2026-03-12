import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { expect } from 'chai';
import SubmissionCard from '../../../components/SubmissionCard';

describe('SubmissionCard', () => {
  beforeEach(() => {
    // Define stub web components if needed
    const defineStub = name => {
      if (
        typeof window !== 'undefined' &&
        window.customElements &&
        !window.customElements.get(name)
      ) {
        window.customElements.define(
          name,
          class extends HTMLElement {
            connectedCallback() {
              this.setAttribute('data-stubbed', 'true');
            }
          },
        );
      }
    };

    defineStub('va-card');
    defineStub('va-icon');
  });
  const getStore = () =>
    createStore(() => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        accredited_representative_portal_claimant_details: true,
      },
    }));
  const baseSubmission = {
    id: '1234',
    lastName: 'Doe',
    firstName: 'John',
    submittedDate: '2024-06-01T13:45:30Z',
    confirmationNumber: 'ABC123456',
    vbmsStatus: 'received',
    vbmsReceivedDate: '2024-06-02T09:10:00Z',
    formType: '21-22',
    packet: false,
  };

  it('renders name, confirmation number, and form type', () => {
    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <SubmissionCard submission={baseSubmission} />
        </MemoryRouter>
      </Provider>,
    );

    const nameHeading = container.querySelector('h3');
    expect(nameHeading).to.exist;
    expect(nameHeading.textContent).to.equal('Doe, John');

    const formName = container.querySelector('.submission__card-form-name');
    expect(formName).to.exist;
    expect(formName.textContent).to.include('VA 21-22');

    const statusText = container.querySelector('.submission__card-status');
    expect(statusText.textContent).to.include('Confirmation:');
    expect(statusText.textContent).to.include('ABC123456');
    const statusRow = container.querySelector('.submission__card-status--row');
    expect(statusRow.textContent).to.include('VBMS eFolder status:');
    expect(statusRow.textContent).to.include('Received');
  });

  it('renders status message for "processing_error"', () => {
    const erroredSubmission = {
      ...baseSubmission,
      vbmsStatus: 'processing_error',
    };

    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <SubmissionCard submission={erroredSubmission} />
        </MemoryRouter>
      </Provider>,
    );

    const status = container.querySelector('.submission__card-status--row');
    expect(status.textContent).to.include('Processing error');
  });

  it('renders fallback status for "awaiting_receipt"', () => {
    const awaitingSubmission = {
      ...baseSubmission,
      vbmsStatus: 'awaiting_receipt',
    };

    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <SubmissionCard submission={awaitingSubmission} />
        </MemoryRouter>
      </Provider>,
    );

    const status = container.querySelector('.submission__card-status--row');
    expect(status.textContent).to.include('Awaiting receipt');
  });
});
