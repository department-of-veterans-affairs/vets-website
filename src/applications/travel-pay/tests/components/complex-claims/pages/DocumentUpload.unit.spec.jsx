import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor } from '@testing-library/react';
import DocumentUpload from '../../../../components/complex-claims/pages/DocumentUpload';
import { ACCEPTED_FILE_TYPES } from '../../../../constants';

describe('DocumentUpload component', () => {
  const defaultProps = {
    currentDocument: null,
    handleDocumentChange: () => {},
    uploadError: '',
  };

  it('renders component correctly', () => {
    const { container } = render(<DocumentUpload {...defaultProps} />);

    expect(container.querySelector('va-file-input')).to.exist;
    expect(container.querySelector('va-additional-info')).to.exist;
  });

  it('calls handleDocumentChange when a file is selected', async () => {
    const handleDocumentChange = sinon.spy();
    const { container } = render(
      <DocumentUpload
        {...defaultProps}
        handleDocumentChange={handleDocumentChange}
      />,
    );

    const fileInput = container.querySelector('va-file-input');

    const testFile = new File(['dummy content'], 'receipt.pdf', {
      type: 'application/pdf',
    });

    // Fire the vaChange event as va-file-input would emit
    const event = new CustomEvent('vaChange', {
      detail: { files: [testFile] },
      bubbles: true,
      composed: true,
    });
    fileInput.dispatchEvent(event);

    await waitFor(() => {
      expect(handleDocumentChange.calledOnce).to.be.true;
      // Verify the file passed
      const eventArg = handleDocumentChange.firstCall.args[0];
      expect(eventArg.detail.files[0]).to.equal(testFile);
    });
  });

  it('accepts only allowed file types', () => {
    const { container } = render(<DocumentUpload {...defaultProps} />);

    const fileInput = container.querySelector('va-file-input');
    const acceptAttr = fileInput.getAttribute('accept').split(',');

    const expected = ACCEPTED_FILE_TYPES.map(ext => `${ext}`);
    expect(acceptAttr).to.deep.equal(expected);
  });

  it('enforces max and min file size', () => {
    const { container } = render(<DocumentUpload {...defaultProps} />);

    const fileInput = container.querySelector('va-file-input');
    expect(Number(fileInput.getAttribute('max-file-size'))).to.equal(5200000);
    expect(Number(fileInput.getAttribute('min-file-size'))).to.equal(0);
  });

  it('displays uploadError when provided', () => {
    const errorMessage = 'File is too large';
    const { container } = render(
      <DocumentUpload {...defaultProps} uploadError={errorMessage} />,
    );

    const fileInput = container.querySelector('va-file-input');
    expect(fileInput.getAttribute('error')).to.equal(errorMessage);
  });

  it('does not display error when uploadError is empty', () => {
    const { container } = render(
      <DocumentUpload {...defaultProps} uploadError="" />,
    );

    const fileInput = container.querySelector('va-file-input');
    expect(fileInput.getAttribute('error')).to.be.null;
  });
});
