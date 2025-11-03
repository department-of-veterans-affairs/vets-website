import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { NursingOfficialInformationReview } from '@bio-aquia/21-0779-nursing-home-information/pages/nursing-official-information/nursing-official-information-review';

describe('NursingOfficialInformationReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Nursing official information';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <NursingOfficialInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <NursingOfficialInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Nursing official information');
    });

    it('should render edit button', () => {
      const { container } = render(
        <NursingOfficialInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });

    it('should render review structure', () => {
      const { container } = render(
        <NursingOfficialInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewDl = container.querySelector('dl.review');
      expect(reviewDl).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display complete nursing official information', () => {
      const data = {
        nursingOfficialInformation: {
          firstName: 'Jane',
          lastName: 'Smith',
          jobTitle: 'Director of Nursing',
          phoneNumber: '5551234567',
        },
      };

      const { container } = render(
        <NursingOfficialInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Jane Smith');
      expect(container.textContent).to.include('Director of Nursing');
      expect(container.textContent).to.include('555-123-4567');
    });

    it('should format phone number correctly', () => {
      const data = {
        nursingOfficialInformation: {
          firstName: 'Jane',
          lastName: 'Smith',
          jobTitle: 'RN',
          phoneNumber: '1234567890',
        },
      };

      const { container } = render(
        <NursingOfficialInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('123-456-7890');
    });

    it('should display "Not provided" for missing first and last name', () => {
      const data = {
        nursingOfficialInformation: {
          jobTitle: 'RN',
          phoneNumber: '5551234567',
        },
      };

      const { container } = render(
        <NursingOfficialInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const nameRow = Array.from(reviewRows).find(row =>
        row.textContent.includes('Name'),
      );
      expect(nameRow.textContent).to.include('Not provided');
    });

    it('should display "Not provided" for missing job title', () => {
      const data = {
        nursingOfficialInformation: {
          firstName: 'Jane',
          lastName: 'Smith',
          phoneNumber: '5551234567',
        },
      };

      const { container } = render(
        <NursingOfficialInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const jobTitleRow = Array.from(reviewRows).find(row =>
        row.textContent.includes('Job title'),
      );
      expect(jobTitleRow.textContent).to.include('Not provided');
    });

    it('should display "Not provided" for missing phone number', () => {
      const data = {
        nursingOfficialInformation: {
          firstName: 'Jane',
          lastName: 'Smith',
          jobTitle: 'RN',
        },
      };

      const { container } = render(
        <NursingOfficialInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const phoneRow = Array.from(reviewRows).find(row =>
        row.textContent.includes('Phone number'),
      );
      expect(phoneRow.textContent).to.include('Not provided');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <NursingOfficialInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Not provided');
    });

    it('should handle missing nursingOfficialInformation section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <NursingOfficialInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should display only first name when last name is missing', () => {
      const data = {
        nursingOfficialInformation: {
          firstName: 'Jane',
          jobTitle: 'RN',
          phoneNumber: '5551234567',
        },
      };

      const { container } = render(
        <NursingOfficialInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Jane');
    });

    it('should display only last name when first name is missing', () => {
      const data = {
        nursingOfficialInformation: {
          lastName: 'Smith',
          jobTitle: 'RN',
          phoneNumber: '5551234567',
        },
      };

      const { container } = render(
        <NursingOfficialInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Smith');
    });

    it('should handle phone number with formatting', () => {
      const data = {
        nursingOfficialInformation: {
          firstName: 'Jane',
          lastName: 'Smith',
          jobTitle: 'RN',
          phoneNumber: '(555) 123-4567',
        },
      };

      const { container } = render(
        <NursingOfficialInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('555-123-4567');
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <NursingOfficialInformationReview
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
