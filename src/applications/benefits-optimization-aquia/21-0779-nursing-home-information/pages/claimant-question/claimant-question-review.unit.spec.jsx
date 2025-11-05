import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ClaimantQuestionReview } from '@bio-aquia/21-0779-nursing-home-information/pages/claimant-question/claimant-question-review';

describe('ClaimantQuestionReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Claimant question';

  it('should render without errors', () => {
    const { container } = render(
      <ClaimantQuestionReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container).to.exist;
  });

  it('should display veteran patient type', () => {
    const data = {
      claimantQuestion: { patientType: 'veteran' },
    };
    const { container } = render(
      <ClaimantQuestionReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('A Veteran');
  });

  it('should display spouse or parent patient type', () => {
    const data = {
      claimantQuestion: { patientType: 'spouseOrParent' },
    };
    const { container } = render(
      <ClaimantQuestionReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include(
      'The spouse or parent of a Veteran',
    );
  });

  it('should display "Not provided" for missing patient type', () => {
    const { container } = render(
      <ClaimantQuestionReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Not provided');
  });

  it('should render edit button', () => {
    const { container } = render(
      <ClaimantQuestionReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    const editButton = container.querySelector('va-button');
    expect(editButton).to.exist;
  });
});
