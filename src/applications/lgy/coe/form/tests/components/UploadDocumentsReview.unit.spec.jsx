import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { UploadDocumentsReview } from '../../components/UploadDocumentsReview';

describe('UploadDocumentsReview', () => {
  const mockChildren = {
    props: {
      formData: [
        {
          name: 'test-file-1.pdf',
          additionalData: {
            attachmentType: 'Discharge or separation papers (DD214)',
          },
        },
        {
          name: 'test-file-2.jpg',
          additionalData: {
            attachmentType: 'Marriage certificate',
          },
        },
      ],
    },
  };

  it('should render', () => {
    const { container } = render(
      <UploadDocumentsReview>{mockChildren}</UploadDocumentsReview>,
    );
    expect(container).to.exist;
  });

  it('should display file names for all uploaded files', () => {
    const { getByText } = render(
      <UploadDocumentsReview>{mockChildren}</UploadDocumentsReview>,
    );
    expect(getByText('test-file-1.pdf')).to.exist;
    expect(getByText('test-file-2.jpg')).to.exist;
  });

  it('should display document types for all files', () => {
    const { getByText } = render(
      <UploadDocumentsReview>{mockChildren}</UploadDocumentsReview>,
    );
    expect(getByText('Discharge or separation papers (DD214)')).to.exist;
    expect(getByText('Marriage certificate')).to.exist;
  });

  it('should render multiple files correctly', () => {
    const { getAllByText } = render(
      <UploadDocumentsReview>{mockChildren}</UploadDocumentsReview>,
    );
    const fileNameLabels = getAllByText('File name');
    const documentTypeLabels = getAllByText('Document type');
    expect(fileNameLabels).to.have.length(2);
    expect(documentTypeLabels).to.have.length(2);
  });

  it('should handle empty file data gracefully', () => {
    const emptyChildren = {
      props: {
        formData: [],
      },
    };
    const { queryAllByText } = render(
      <UploadDocumentsReview>{emptyChildren}</UploadDocumentsReview>,
    );
    const fileNameLabels = queryAllByText('File name');
    expect(fileNameLabels).to.have.length(0);
  });

  it('should handle undefined children without crashing', () => {
    const { container } = render(
      <UploadDocumentsReview>{undefined}</UploadDocumentsReview>,
    );
    expect(container).to.exist;
  });

  it('should handle null formData without crashing', () => {
    const nullChildren = {
      props: {
        formData: null,
      },
    };
    const { container } = render(
      <UploadDocumentsReview>{nullChildren}</UploadDocumentsReview>,
    );
    expect(container).to.exist;
  });
});
