import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { VeteranIdentificationInfoReview } from '@bio-aquia/21-0779-nursing-home-information/pages/veteran-identification-info/veteran-identification-info-review';

describe('VeteranIdentificationInfoReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Veteran identification';

  it('should render without errors', () => {
    const { container } = render(
      <VeteranIdentificationInfoReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container).to.exist;
  });

  it('should display veteran SSN and VA file number', () => {
    const data = {
      veteranIdentificationInfo: {
        ssn: '123456789',
        vaFileNumber: '12345678',
      },
    };
    const { container } = render(
      <VeteranIdentificationInfoReview
        data={data}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container).to.exist;
  });

  it('should display "Not provided" for missing data', () => {
    const { container } = render(
      <VeteranIdentificationInfoReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    expect(container.textContent).to.include('Not provided');
  });

  it('should render edit button', () => {
    const { container } = render(
      <VeteranIdentificationInfoReview
        data={{}}
        editPage={mockEditPage}
        title={mockTitle}
      />,
    );
    const editButton = container.querySelector('va-button');
    expect(editButton).to.exist;
  });
});
