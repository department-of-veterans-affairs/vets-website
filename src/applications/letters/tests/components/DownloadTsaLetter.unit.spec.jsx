/* eslint-disable lines-between-class-members */
/* eslint-disable camelcase */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as apiModule from '~/platform/utilities/api';
import * as recordEventModule from 'platform/monitoring/record-event';
import { DownloadTsaLetter } from '../../components/DownloadTsaLetter';

describe('DownloadTsaLetter', () => {
  let sandbox;
  let apiRequestStub;
  let recordEventStub;
  let createObjectURLStub;
  let originalURL;
  let observerCallback;

  const mockLetter = {
    attributes: {
      document_id: '{ABCDE-FGHIJ-KLMNO}',
      received_at: '2025-10-10',
    },
  };
  const mockBlob = new Blob(['test'], { type: 'application/pdf' });
  let mockResponse;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
    recordEventStub = sandbox.stub(recordEventModule, 'default');
    createObjectURLStub = sandbox.stub().returns('blob:mock-url');
    originalURL = window.URL;
    const mockURL = {
      createObjectURL: createObjectURLStub,
    };
    window.URL = mockURL;
    window.webkitURL = mockURL;
    global.MutationObserver = class {
      constructor(callback) {
        observerCallback = callback;
      }
      // eslint-disable-next-line class-methods-use-this
      observe() {}
      // eslint-disable-next-line class-methods-use-this
      disconnect() {}
    };
    mockResponse = {
      blob: sandbox.stub().resolves(mockBlob),
    };
  });

  afterEach(() => {
    sandbox.restore();
    window.URL = originalURL;
    delete window.webkitURL;
  });

  it('renders the accordion with title', () => {
    const { container } = render(<DownloadTsaLetter letter={mockLetter} />);
    const accordionItem = container.querySelector('va-accordion-item');
    const headline = accordionItem.querySelector('h3[slot="headline"]');
    expect(headline.textContent).to.equal(
      'TSA PreCheck Application Fee Waiver Letter',
    );
  });

  it('renders description text', () => {
    const { getByText } = render(<DownloadTsaLetter letter={mockLetter} />);
    expect(
      getByText(
        /shows you’re eligible for free enrollment in Transportation Security Administration/,
      ),
    ).to.exist;
    expect(getByText(/You’ll need to print this letter and bring it with you/))
      .to.exist;
  });

  it('does not fetch letter data on initial render when accordion is closed', () => {
    render(<DownloadTsaLetter letter={mockLetter} />);
    expect(apiRequestStub.called).to.be.false;
  });

  it('fetches letter data when accordion is opened', async () => {
    apiRequestStub.resolves(mockResponse);
    const { container } = render(<DownloadTsaLetter letter={mockLetter} />);
    const accordion = container.querySelector('va-accordion-item');
    accordion.setAttribute('open', '');
    if (observerCallback) {
      observerCallback();
    }
    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.be.true;
    });
    expect(apiRequestStub.firstCall.args[0]).to.include(
      `/v0/tsa_letter/${mockLetter.attributes.document_id}`,
    );
  });

  it('displays loading indicator while fetching', () => {
    apiRequestStub.returns(new Promise(() => {}));
    const { container } = render(<DownloadTsaLetter letter={mockLetter} />);
    const accordion = container.querySelector('va-accordion-item');
    accordion.setAttribute('open', '');
    const loading = container.querySelector('va-loading-indicator');
    expect(loading).to.exist;
  });

  it('displays download link after successful fetch', async () => {
    apiRequestStub.resolves(mockResponse);
    const { container } = render(<DownloadTsaLetter letter={mockLetter} />);
    const accordion = container.querySelector('va-accordion-item');
    accordion.setAttribute('open', '');
    if (observerCallback) {
      observerCallback();
    }
    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.be.true;
    });
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('blob:mock-url');
    expect(link.getAttribute('filetype')).to.equal('PDF');
    expect(link.getAttribute('filename')).to.equal(
      'TSA PreCheck Application Fee Waiver Letter.pdf',
    );
  });

  it('records successful API event', async () => {
    apiRequestStub.resolves(mockResponse);
    const { container } = render(<DownloadTsaLetter letter={mockLetter} />);
    const accordion = container.querySelector('va-accordion-item');
    accordion.setAttribute('open', '');
    if (observerCallback) {
      observerCallback();
    }
    await waitFor(() => {
      expect(
        recordEventStub.calledWith({
          event: 'api_call',
          'api-name': 'GET /v0/tsa_letter/:id',
          'api-status': 'successful',
        }),
      ).to.be.true;
    });
  });

  it('displays error alert on API failure', async () => {
    apiRequestStub.rejects(new Error('API Error'));
    const { container, findByText } = render(
      <DownloadTsaLetter letter={mockLetter} />,
    );
    const accordion = container.querySelector('va-accordion-item');
    accordion.setAttribute('open', '');
    if (observerCallback) {
      observerCallback();
    }
    const errorHeadline = await findByText(
      /Your TSA PreCheck Application Fee Waiver Letter is currently unavailable/,
    );
    expect(errorHeadline).to.exist;
    const errorText = await findByText(
      /If you need help accessing your letter/,
    );
    expect(errorText).to.exist;
  });

  it('records error API event on failure', async () => {
    apiRequestStub.rejects(new Error('API Error'));
    const { container } = render(<DownloadTsaLetter letter={mockLetter} />);
    const accordion = container.querySelector('va-accordion-item');
    accordion.setAttribute('open', '');
    if (observerCallback) {
      observerCallback();
    }
    await waitFor(() => {
      expect(
        recordEventStub.calledWith({
          event: 'api_call',
          'api-name': 'GET /v0/tsa_letter/:id',
          'api-status': 'error',
        }),
      ).to.be.true;
    });
  });

  it('creates object URL from blob', async () => {
    apiRequestStub.resolves(mockResponse);
    const { container } = render(<DownloadTsaLetter letter={mockLetter} />);
    const accordion = container.querySelector('va-accordion-item');
    accordion.setAttribute('open', '');
    if (observerCallback) {
      observerCallback();
    }
    await waitFor(() => {
      expect(createObjectURLStub.calledOnce).to.be.true;
      expect(createObjectURLStub.firstCall.args[0]).to.equal(mockBlob);
    });
  });

  it('only fetches letter data once when accordion is opened multiple times', async () => {
    apiRequestStub.resolves(mockResponse);
    const { container } = render(<DownloadTsaLetter letter={mockLetter} />);
    const accordion = container.querySelector('va-accordion-item');
    accordion.setAttribute('open', '');
    if (observerCallback) {
      observerCallback();
    }
    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.be.true;
    });
    accordion.removeAttribute('open');
    accordion.setAttribute('open', '');
    expect(apiRequestStub.calledOnce).to.be.true;
  });
});
