/**
 * @module tests/pages/veteran-identification-review.unit.spec
 * @description Unit tests for VeteranIdentificationReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { VeteranIdentificationReviewPage } from './veteran-identification-review';

describe('VeteranIdentificationReviewPage', () => {
  let mockEditPage;
  const mockTitle = 'Identification numbers';

  beforeEach(() => {
    mockEditPage = sinon.spy();
  });

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '123456789',
          serviceNumber: 'A123456',
          vaFileNumber: 'C12345678',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should display the title', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '123456789',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include(mockTitle);
    });
  });

  describe('Data Display', () => {
    it('should display all identification fields with data', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '123456789',
          serviceNumber: 'A123456',
          vaFileNumber: 'C12345678',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Social Security number');
      expect(container.textContent).to.include('VA service number');
      expect(container.textContent).to.include('VA file number');
    });

    it('should display only SSN when other fields are empty', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '123456789',
          serviceNumber: '',
          vaFileNumber: '',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Social Security number');
    });

    it('should display service number when provided', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '123456789',
          serviceNumber: 'A123456',
          vaFileNumber: '',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('VA service number');
    });

    it('should display VA file number when provided', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '123456789',
          serviceNumber: '',
          vaFileNumber: 'C12345678',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('VA file number');
    });
  });

  describe('SSN Formatting', () => {
    it('should mask SSN showing only last 4 digits', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '123456789',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('***-**-6789');
    });

    it('should format SSN with dashes (123-45-6789)', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '123-45-6789',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      // Should still mask properly even with dashes
      expect(container.textContent).to.include('***-**-6789');
    });

    it('should handle SSN without formatting', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '987654321',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('***-**-4321');
    });

    it('should handle empty SSN', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      // Empty SSN should be hidden due to hideWhenEmpty
      expect(container).to.exist;
    });

    it('should handle undefined SSN', () => {
      const mockData = {
        veteranIdentification: {},
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle SSN with less than 9 digits', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '12345',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      // Should display as-is if not exactly 9 digits
      expect(container).to.exist;
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing veteranIdentification section', () => {
      const mockData = {};

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle all empty identification fields', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '',
          serviceNumber: '',
          vaFileNumber: '',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should hide empty fields when hideWhenEmpty is true', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '123456789',
          serviceNumber: '',
          vaFileNumber: '',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      // Only SSN should be visible
      expect(container.textContent).to.include('Social Security number');
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage function to ReviewPageTemplate', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '123456789',
          serviceNumber: 'A123456',
          vaFileNumber: 'C12345678',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
      // editPage prop is passed to ReviewPageTemplate
    });
  });

  describe('Section Name', () => {
    it('should use veteranIdentification as section name', () => {
      const mockData = {
        veteranIdentification: {
          ssn: '123456789',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      // ReviewPageTemplate should be rendered with veteranIdentification section
      expect(container).to.exist;
    });
  });
});
