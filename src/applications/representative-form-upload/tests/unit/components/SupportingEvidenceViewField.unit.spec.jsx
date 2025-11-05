import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import SupportingEvidenceViewField from '../../../components/SupportingEvidenceViewField';

const TEST_URL =
  'https://dev.va.gov/representative/representative-form-upload/submit-va-form-21-686c/review-and-submit';

describe('SupportingEvidenceViewField', () => {
  const defaultEditButton = () => <va-button text="edit" />;

  beforeEach(() => {
    window.location = new URL(TEST_URL);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders only VA form when no supporting documents', () => {
    const formData = {
      uploadedFile: { name: 'va-form.pdf', size: 12345 },
      supportingDocuments: [],
    };

    const { getByText, queryByText } = render(
      <SupportingEvidenceViewField
        formData={formData}
        defaultEditButton={defaultEditButton}
      />,
    );

    expect(getByText('VA Form 21-686c')).to.exist;
    expect(getByText('va-form.pdf')).to.exist;
    expect(queryByText('Upload supporting evidence')).to.be.null;
    expect(queryByText('Supporting evidence')).to.be.null;
  });

  it('renders one supporting document correctly', () => {
    const formData = {
      uploadedFile: { name: 'va-form.pdf', size: 12345 },
      supportingDocuments: [{ name: 'support-doc1.pdf', size: 23456 }],
    };

    const { getByText, queryAllByText } = render(
      <SupportingEvidenceViewField
        formData={formData}
        defaultEditButton={defaultEditButton}
      />,
    );

    expect(getByText('VA Form 21-686c')).to.exist;
    expect(getByText('va-form.pdf')).to.exist;
    expect(getByText('Upload supporting evidence')).to.exist;
    expect(getByText('support-doc1.pdf')).to.exist;

    const labels = queryAllByText('Supporting evidence');
    expect(labels).to.have.lengthOf(1);
  });

  it('renders two supporting documents correctly', () => {
    const formData = {
      uploadedFile: { name: 'va-form.pdf', size: 12345 },
      supportingDocuments: [
        { name: 'support-doc1.pdf', size: 23456 },
        { name: 'support-doc2.pdf', size: 34567 },
      ],
    };

    const { getByText, queryAllByText } = render(
      <SupportingEvidenceViewField
        formData={formData}
        defaultEditButton={defaultEditButton}
      />,
    );

    expect(getByText('VA Form 21-686c')).to.exist;
    expect(getByText('va-form.pdf')).to.exist;
    expect(getByText('Upload supporting evidence')).to.exist;
    expect(getByText('support-doc1.pdf')).to.exist;
    expect(getByText('support-doc2.pdf')).to.exist;

    const labels = queryAllByText('Supporting evidence');
    expect(labels).to.have.lengthOf(2);
  });
});
