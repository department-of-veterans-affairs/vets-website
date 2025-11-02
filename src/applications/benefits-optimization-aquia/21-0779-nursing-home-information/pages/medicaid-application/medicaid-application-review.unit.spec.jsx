import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { MedicaidApplicationReview } from '@bio-aquia/21-0779-nursing-home-information/pages/medicaid-application/medicaid-application-review';

describe('MedicaidApplicationReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Medicaid application';

  it('should render without errors', () => {
    const { container } = render(
      <MedicaidApplicationReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container).to.exist;
  });

  it('should display "Yes" when applied', () => {
    const data = {
      medicaidApplication: { hasAppliedForMedicaid: 'yes' },
    };
    const { container } = render(
      <MedicaidApplicationReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Yes');
  });

  it('should display "No" when not applied', () => {
    const data = {
      medicaidApplication: { hasAppliedForMedicaid: 'no' },
    };
    const { container } = render(
      <MedicaidApplicationReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('No');
  });

  it('should display "Not provided" for missing data', () => {
    const { container } = render(
      <MedicaidApplicationReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Not provided');
  });

  it('should render edit button', () => {
    const { container } = render(
      <MedicaidApplicationReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    const editButton = container.querySelector('va-button');
    expect(editButton).to.exist;
  });
});
