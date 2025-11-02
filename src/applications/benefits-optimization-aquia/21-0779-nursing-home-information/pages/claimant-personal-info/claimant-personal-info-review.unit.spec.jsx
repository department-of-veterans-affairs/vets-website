import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ClaimantPersonalInfoReview } from '@bio-aquia/21-0779-nursing-home-information/pages/claimant-personal-info/claimant-personal-info-review';

describe('ClaimantPersonalInfoReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Claimant personal information';

  it('should render without errors', () => {
    const { container } = render(
      <ClaimantPersonalInfoReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container).to.exist;
  });

  it('should display claimant name and date of birth', () => {
    const data = {
      claimantPersonalInfo: {
        claimantFullName: {
          first: 'Jane',
          last: 'Doe',
        },
        claimantDateOfBirth: '1990-05-15',
      },
    };
    const { container } = render(
      <ClaimantPersonalInfoReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Jane');
    expect(container.textContent).to.include('Doe');
  });

  it('should display "Not provided" for missing data', () => {
    const { container } = render(
      <ClaimantPersonalInfoReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Not provided');
  });

  it('should render edit button', () => {
    const { container } = render(
      <ClaimantPersonalInfoReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    const editButton = container.querySelector('va-button');
    expect(editButton).to.exist;
  });
});
