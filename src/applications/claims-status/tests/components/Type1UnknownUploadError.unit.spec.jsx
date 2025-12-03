import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';

import Type1UnknownUploadError from '../../components/Type1UnknownUploadError';
import { renderWithRouter } from '../utils';

describe('<Type1UnknownUploadError>', () => {
  const mockErrorFiles = [
    {
      fileName: 'test-document.pdf',
      docType: 'Medical records',
    },
    {
      fileName: 'another-file.jpg',
      docType: 'Supporting documents',
    },
  ];

  it('should not render when no error files provided', () => {
    const { container } = renderWithRouter(
      <Type1UnknownUploadError errorFiles={null} />,
    );
    expect(container.firstChild).to.be.null;
  });

  it('should not render when empty error files array', () => {
    const { container } = renderWithRouter(
      <Type1UnknownUploadError errorFiles={[]} />,
    );
    expect(container.firstChild).to.be.null;
  });

  it('should render error message and file list for single file', () => {
    const singleFile = [mockErrorFiles[0]];
    const { getByText } = renderWithRouter(
      <Type1UnknownUploadError errorFiles={singleFile} />,
    );

    expect(
      getByText(text =>
        text.includes("We're sorry. There was a problem with our system"),
      ),
    ).to.exist;
    expect(getByText("File we couldn't process:")).to.exist;
    expect(getByText('test-document.pdf')).to.exist;
    expect(getByText('File type: Medical records')).to.exist;
  });

  it('should render error message and file list for multiple files', () => {
    const { getByText } = renderWithRouter(
      <Type1UnknownUploadError errorFiles={mockErrorFiles} />,
    );

    expect(
      getByText(text =>
        text.includes("We're sorry. There was a problem with our system"),
      ),
    ).to.exist;
    expect(getByText("Files we couldn't process:")).to.exist;
    expect(getByText('test-document.pdf')).to.exist;
    expect(getByText('another-file.jpg')).to.exist;
    expect(getByText('File type: Medical records')).to.exist;
    expect(getByText('File type: Supporting documents')).to.exist;
  });

  it('should handle missing docType gracefully', () => {
    const filesWithMissingDocType = [
      { fileName: 'test-file.pdf', docType: null },
    ];
    const { getByText } = renderWithRouter(
      <Type1UnknownUploadError errorFiles={filesWithMissingDocType} />,
    );

    expect(getByText('File type: Unknown')).to.exist;
  });

  it('should render link with correct text and href', () => {
    const { container } = renderWithRouter(
      <Type1UnknownUploadError errorFiles={mockErrorFiles} />,
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      'Learn how to submit documents by mail or in person',
    );
    expect(link.getAttribute('href')).to.equal('../files#other-ways-to-send');
  });

  it('should have proper accessibility attributes', () => {
    const { container } = renderWithRouter(
      <Type1UnknownUploadError errorFiles={mockErrorFiles} />,
    );

    const fileList = container.querySelector('ul');
    expect(fileList.getAttribute('aria-label')).to.equal(
      "Files that couldn't be processed",
    );
  });

  it('should handle link click without errors', () => {
    const { container } = renderWithRouter(
      <Type1UnknownUploadError errorFiles={mockErrorFiles} />,
    );

    const link = container.querySelector('va-link-action');

    // Should not throw an error when clicked
    expect(() => fireEvent.click(link)).to.not.throw();
  });
});
