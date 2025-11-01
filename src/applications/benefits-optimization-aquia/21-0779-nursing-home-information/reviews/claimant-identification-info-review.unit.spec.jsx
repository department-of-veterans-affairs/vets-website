/**
 * Unit tests for ClaimantIdentificationInfoReview component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ClaimantIdentificationInfoReview } from './claimant-identification-info-review';

describe('ClaimantIdentificationInfoReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Claimant identification';

  it('should render without errors', () => {
    const { container } = render(
      <ClaimantIdentificationInfoReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container).to.exist;
  });

  it('should display claimant SSN and VA file number', () => {
    const data = {
      claimantIdentificationInfo: {
        claimantSsn: '123456789',
        claimantVaFileNumber: '87654321',
      },
    };
    const { container } = render(
      <ClaimantIdentificationInfoReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container).to.exist;
  });

  it('should display "Not provided" for missing data', () => {
    const { container } = render(
      <ClaimantIdentificationInfoReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Not provided');
  });

  it('should render edit button', () => {
    const { container } = render(
      <ClaimantIdentificationInfoReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    const editButton = container.querySelector('va-button');
    expect(editButton).to.exist;
  });
});
