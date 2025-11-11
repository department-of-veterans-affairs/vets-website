import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor } from '@testing-library/react';
import DocumentUpload from '../../../../components/complex-claims/pages/DocumentUpload';
import { ACCEPTED_FILE_TYPES } from '../../../../constants';

describe('DocumentUpload component', () => {
  it('renders component correctly', () => {
    const { container } = render(
      <DocumentUpload handleDocumentUpload={() => {}} />,
    );

    expect(container.querySelector('va-file-input')).to.exist;
    expect(container.querySelector('va-additional-info')).to.exist;
  });

  it('calls handleDocumentUpload when a file is selected', async () => {
    const handleDocumentUpload = sinon.spy();
    const { container } = render(
      <DocumentUpload handleDocumentUpload={handleDocumentUpload} />,
    );

    const fileInput = container.querySelector('va-file-input');

    const testFile = new File(['dummy content'], 'receipt.pdf', {
      type: 'application/pdf',
    });

    // Fire the change event as va-file-input would emit
    const event = new CustomEvent('vaChange', {
      detail: { files: [testFile] },
      bubbles: true,
      composed: true,
    });
    fileInput.dispatchEvent(event);

    await waitFor(() => {
      expect(handleDocumentUpload.calledOnce).to.be.true;
      // Optionally verify the file passed
      const eventArg = handleDocumentUpload.firstCall.args[0];
      expect(eventArg.detail.files[0]).to.equal(testFile);
    });
  });

  it('accepts only allowed file types', () => {
    const { container } = render(
      <DocumentUpload handleDocumentUpload={() => {}} />,
    );

    const fileInput = container.querySelector('va-file-input');

    const acceptedExtensions = ACCEPTED_FILE_TYPES.map(ext => `${ext}`);
    const acceptAttr = fileInput.getAttribute('accept').split(',');
    expect(acceptAttr).to.deep.equal(acceptedExtensions);
  });

  it('enforces max file size of 5MB', () => {
    const { container } = render(
      <DocumentUpload handleDocumentUpload={() => {}} />,
    );

    const fileInput = container.querySelector('va-file-input');
    expect(Number(fileInput.getAttribute('max-file-size'))).to.equal(5200000);
    expect(Number(fileInput.getAttribute('min-file-size'))).to.equal(0);
  });
});
