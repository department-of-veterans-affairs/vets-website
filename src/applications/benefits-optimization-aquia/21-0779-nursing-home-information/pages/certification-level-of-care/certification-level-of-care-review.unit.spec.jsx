import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { CertificationLevelOfCareReview } from '@bio-aquia/21-0779-nursing-home-information/pages/certification-level-of-care/certification-level-of-care-review';

describe('CertificationLevelOfCareReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Certification level of care';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <CertificationLevelOfCareReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <CertificationLevelOfCareReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Certification level of care');
    });

    it('should render edit button', () => {
      const { container } = render(
        <CertificationLevelOfCareReview
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
    it('should display skilled nursing care', () => {
      const data = {
        certificationLevelOfCare: {
          levelOfCare: 'skilled',
        },
      };

      const { container } = render(
        <CertificationLevelOfCareReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Skilled nursing care');
    });

    it('should display intermediate nursing care', () => {
      const data = {
        certificationLevelOfCare: {
          levelOfCare: 'intermediate',
        },
      };

      const { container } = render(
        <CertificationLevelOfCareReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Intermediate nursing care');
    });

    it('should display "Not provided" for missing level of care', () => {
      const data = {
        certificationLevelOfCare: {},
      };

      const { container } = render(
        <CertificationLevelOfCareReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <CertificationLevelOfCareReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Not provided');
    });

    it('should handle missing certificationLevelOfCare section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <CertificationLevelOfCareReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null level of care', () => {
      const data = {
        certificationLevelOfCare: {
          levelOfCare: null,
        },
      };

      const { container } = render(
        <CertificationLevelOfCareReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle undefined level of care', () => {
      const data = {
        certificationLevelOfCare: {
          levelOfCare: undefined,
        },
      };

      const { container } = render(
        <CertificationLevelOfCareReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle empty string level of care', () => {
      const data = {
        certificationLevelOfCare: {
          levelOfCare: '',
        },
      };

      const { container } = render(
        <CertificationLevelOfCareReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <CertificationLevelOfCareReview
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
