import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { MedicaidFacilityReview } from '@bio-aquia/21-0779-nursing-home-information/pages/medicaid-facility/medicaid-facility-review';

describe('MedicaidFacilityReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Medicaid facility';

  it('should render without errors', () => {
    const { container } = render(
      <MedicaidFacilityReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container).to.exist;
  });

  it('should display "Yes" when approved', () => {
    const data = {
      medicaidFacility: { isMedicaidApproved: 'yes' },
    };
    const { container } = render(
      <MedicaidFacilityReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Yes');
  });

  it('should display "No" when not approved', () => {
    const data = {
      medicaidFacility: { isMedicaidApproved: 'no' },
    };
    const { container } = render(
      <MedicaidFacilityReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('No');
  });

  it('should display "Not provided" for missing data', () => {
    const { container } = render(
      <MedicaidFacilityReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Not provided');
  });

  it('should render edit button', () => {
    const { container } = render(
      <MedicaidFacilityReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    const editButton = container.querySelector('va-button');
    expect(editButton).to.exist;
  });
});
