import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { MedicaidStartDateReview } from '@bio-aquia/21-0779-nursing-home-information/pages/medicaid-start-date/medicaid-start-date-review';

describe('MedicaidStartDateReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Medicaid start date';

  it('should render without errors', () => {
    const { container } = render(
      <MedicaidStartDateReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container).to.exist;
  });

  it('should display medicaid start date', () => {
    const data = {
      medicaidStartDateInfo: {
        medicaidStartDate: '2020-01-15',
      },
    };
    const { container } = render(
      <MedicaidStartDateReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container).to.exist;
  });

  it('should display "Not provided" for missing data', () => {
    const { container } = render(
      <MedicaidStartDateReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Not provided');
  });

  it('should render edit button', () => {
    const { container } = render(
      <MedicaidStartDateReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    const editButton = container.querySelector('va-button');
    expect(editButton).to.exist;
  });
});
