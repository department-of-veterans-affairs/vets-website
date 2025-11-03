import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { NursingHomeDetailsReview } from '@bio-aquia/21-0779-nursing-home-information/pages/nursing-home-details/nursing-home-details-review';

describe('NursingHomeDetailsReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Nursing home details';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <NursingHomeDetailsReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <NursingHomeDetailsReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Nursing home details');
    });

    it('should render edit button', () => {
      const { container } = render(
        <NursingHomeDetailsReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display complete nursing home details', () => {
      const data = {
        nursingHomeDetails: {
          nursingHomeName: 'Sunshine Senior Care',
          nursingHomeAddress: {
            street: '123 Main Street',
            city: 'Springfield',
            state: 'IL',
            postalCode: '62701',
          },
        },
      };

      const { container } = render(
        <NursingHomeDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Sunshine Senior Care');
      expect(container.textContent).to.include('123 Main Street');
      expect(container.textContent).to.include('Springfield, IL');
      expect(container.textContent).to.include('62701');
    });

    it('should display "Not provided" for missing nursing home name', () => {
      const data = {
        nursingHomeDetails: {
          nursingHomeAddress: {
            street: '123 Main Street',
            city: 'Springfield',
            state: 'IL',
            postalCode: '62701',
          },
        },
      };

      const { container } = render(
        <NursingHomeDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const nameRow = Array.from(reviewRows).find(row =>
        row.textContent.includes('Nursing home name'),
      );
      expect(nameRow.textContent).to.include('Not provided');
    });

    it('should display "Not provided" for missing address', () => {
      const data = {
        nursingHomeDetails: {
          nursingHomeName: 'Sunshine Senior Care',
        },
      };

      const { container } = render(
        <NursingHomeDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const addressRow = Array.from(reviewRows).find(row =>
        row.textContent.includes('Address'),
      );
      expect(addressRow.textContent).to.include('Not provided');
    });

    it('should display "Not provided" for empty address object', () => {
      const data = {
        nursingHomeDetails: {
          nursingHomeName: 'Sunshine Senior Care',
          nursingHomeAddress: {},
        },
      };

      const { container } = render(
        <NursingHomeDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const addressRow = Array.from(reviewRows).find(row =>
        row.textContent.includes('Address'),
      );
      expect(addressRow.textContent).to.include('Not provided');
    });

    it('should handle partial address with just street', () => {
      const data = {
        nursingHomeDetails: {
          nursingHomeName: 'Sunshine Senior Care',
          nursingHomeAddress: {
            street: '123 Main Street',
          },
        },
      };

      const { container } = render(
        <NursingHomeDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('123 Main Street');
    });

    it('should handle address with city and state', () => {
      const data = {
        nursingHomeDetails: {
          nursingHomeName: 'Sunshine Senior Care',
          nursingHomeAddress: {
            street: '123 Main Street',
            city: 'Springfield',
            state: 'IL',
          },
        },
      };

      const { container } = render(
        <NursingHomeDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Springfield, IL');
    });

    it('should handle address with only city', () => {
      const data = {
        nursingHomeDetails: {
          nursingHomeName: 'Sunshine Senior Care',
          nursingHomeAddress: {
            street: '123 Main Street',
            city: 'Springfield',
          },
        },
      };

      const { container } = render(
        <NursingHomeDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Springfield');
    });

    it('should handle address with only state', () => {
      const data = {
        nursingHomeDetails: {
          nursingHomeName: 'Sunshine Senior Care',
          nursingHomeAddress: {
            street: '123 Main Street',
            state: 'IL',
          },
        },
      };

      const { container } = render(
        <NursingHomeDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('IL');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <NursingHomeDetailsReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Not provided');
    });

    it('should handle missing nursingHomeDetails section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <NursingHomeDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <NursingHomeDetailsReview
          data={{}}
          editPage={customEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });
});
