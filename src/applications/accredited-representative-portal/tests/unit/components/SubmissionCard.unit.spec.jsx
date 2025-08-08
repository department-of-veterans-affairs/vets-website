import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
    url: true,
  };

  it('renders name, confirmation number, and form type', () => {
    const { container } = render(
      <MemoryRouter>
        <SubmissionCard submission={baseSubmission} />
      </MemoryRouter>,
    );

    const nameLink = container.querySelector(
      `[data-testid="submission-card-${baseSubmission.id}-name"]`,
    );
    expect(nameLink).to.exist;
    expect(nameLink.textContent).to.equal('Doe, John');

    const formName = container.querySelector('.submission__card-form-name');
    expect(formName).to.exist;
    expect(formName.textContent).to.include('21-22');

    const statusText = container.querySelector('.submission__card-status');
    expect(statusText.textContent).to.include('Confirmation:');
    expect(statusText.textContent).to.include('ABC123456');
    expect(statusText.textContent).to.include('VBMS eFolder status:');
    expect(statusText.textContent).to.include('Received');
  });

  it('renders without a link if no url is provided', () => {
    const submissionWithoutUrl = {
      ...baseSubmission,
      url: false,
    };

    const { container } = render(
      <MemoryRouter>
        <SubmissionCard submission={submissionWithoutUrl} />
      </MemoryRouter>,
    );

    const nameHeading = container.querySelector('h3');
    expect(nameHeading).to.exist;
    expect(nameHeading.textContent).to.equal('Doe, John');
    expect(container.querySelector('a')).to.not.exist;
  });

  it('renders status message for "processing_error"', () => {
    const erroredSubmission = {
      ...baseSubmission,
      vbmsStatus: 'processing_error',
    };

    const { container } = render(
      <MemoryRouter>
        <SubmissionCard submission={erroredSubmission} />
      </MemoryRouter>,
    );

    const status = container.querySelector('.submission__card-status');
    expect(status.textContent).to.include('Processing error');
    expect(status.textContent).to.include('Resubmit or contact 800-827-1000');
  });

  it('renders fallback status for "awaiting_receipt"', () => {
    const awaitingSubmission = {
      ...baseSubmission,
      vbmsStatus: 'awaiting_receipt',
    };

    const { container } = render(
      <MemoryRouter>
        <SubmissionCard submission={awaitingSubmission} />
      </MemoryRouter>,
    );

    const status = container.querySelector('.submission__card-status');
    expect(status.textContent).to.include('Awaiting receipt');
  });
});
