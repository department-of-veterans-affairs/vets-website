import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { VeteranPersonalInfoReview } from '@bio-aquia/21-0779-nursing-home-information/pages/veteran-personal-info/veteran-personal-info-review';

describe('VeteranPersonalInfoReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Veteran personal information';

  it('should render without errors', () => {
    const { container } = render(
      <VeteranPersonalInfoReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container).to.exist;
  });

  it('should display veteran name and date of birth', () => {
    const data = {
      veteranPersonalInfo: {
        fullName: {
          first: 'John',
          last: 'Smith',
        },
        dateOfBirth: '1985-03-22',
      },
    };
    const { container } = render(
      <VeteranPersonalInfoReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('John');
    expect(container.textContent).to.include('Smith');
  });

  it('should display "Not provided" for missing data', () => {
    const { container } = render(
      <VeteranPersonalInfoReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Not provided');
  });

  it('should render edit button', () => {
    const { container } = render(
      <VeteranPersonalInfoReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    const editButton = container.querySelector('va-button');
    expect(editButton).to.exist;
  });
});
