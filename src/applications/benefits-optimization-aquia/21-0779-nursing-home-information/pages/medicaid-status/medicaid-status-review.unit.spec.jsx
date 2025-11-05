import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { MedicaidStatusReview } from '@bio-aquia/21-0779-nursing-home-information/pages/medicaid-status/medicaid-status-review';

describe('MedicaidStatusReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Medicaid status';

  it('should render without errors', () => {
    const { container } = render(
      <MedicaidStatusReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container).to.exist;
  });

  it('should display "Yes" when covered', () => {
    const data = {
      medicaidStatus: { currentlyCoveredByMedicaid: 'yes' },
    };
    const { container } = render(
      <MedicaidStatusReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Yes');
  });

  it('should display "No" when not covered', () => {
    const data = {
      medicaidStatus: { currentlyCoveredByMedicaid: 'no' },
    };
    const { container } = render(
      <MedicaidStatusReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('No');
  });

  it('should display "Not provided" for missing data', () => {
    const { container } = render(
      <MedicaidStatusReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Not provided');
  });

  it('should render edit button', () => {
    const { container } = render(
      <MedicaidStatusReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    const editButton = container.querySelector('va-button');
    expect(editButton).to.exist;
  });
});
