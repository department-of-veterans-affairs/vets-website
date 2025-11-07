/**
 * @module tests/pages/veteran-information-review.unit.spec
 * @description Unit tests for VeteranInformationReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranInformationReviewPage } from './veteran-information-review';

describe('VeteranInformationReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Veteran identification';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <VeteranInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Veteran identification');
    });

    it('should render edit button', () => {
      const { container } = render(
        <VeteranInformationReviewPage
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
    it('should display veteran identification data with full name', () => {
      const data = {
        veteranIdentification: {
          veteranFullName: {
            first: 'Boba',
            middle: 'Tiberius',
            last: 'Fett',
          },
          veteranSSN: '123-45-6789',
          veteranDOB: '1950-01-15',
        },
      };

      const { container } = render(
        <VeteranInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Boba');
      expect(container.textContent).to.include('Fett');
      expect(container.textContent).to.include('123-45-6789');
    });

    it('should display veteran identification with partial name', () => {
      const data = {
        veteranIdentification: {
          veteranFullName: {
            first: 'Boba',
            last: 'Fett',
          },
          veteranSSN: '987-65-4321',
          veteranDOB: '1945-06-20',
        },
      };

      const { container } = render(
        <VeteranInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Boba');
      expect(container.textContent).to.include('Fett');
      expect(container.textContent).to.include('987-65-4321');
    });

    it('should handle SSN display', () => {
      const data = {
        veteranIdentification: {
          veteranFullName: {
            first: 'Boba',
            last: 'Fett',
          },
          veteranSSN: '111-22-3333',
        },
      };

      const { container } = render(
        <VeteranInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('111-22-3333');
    });

    it('should handle date of birth display', () => {
      const data = {
        veteranIdentification: {
          veteranFullName: {
            first: 'Boba',
            last: 'Fett',
          },
          veteranDOB: '1960-12-31',
        },
      };

      const { container } = render(
        <VeteranInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing veteranIdentification section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <VeteranInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle partial veteranIdentification data', () => {
      const data = {
        veteranIdentification: {
          veteranFullName: {
            first: 'Boba',
            last: 'Fett',
          },
        },
      };

      const { container } = render(
        <VeteranInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Boba');
      expect(container.textContent).to.include('Fett');
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <VeteranInformationReviewPage
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
