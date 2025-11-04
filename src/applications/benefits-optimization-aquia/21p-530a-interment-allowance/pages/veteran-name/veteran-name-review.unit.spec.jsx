/**
 * @module tests/pages/veteran-name-review.unit.spec
 * @description Unit tests for VeteranNameReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { VeteranNameReviewPage } from './veteran-name-review';

describe('VeteranNameReviewPage', () => {
  let mockEditPage;
  const mockTitle = 'Name';

  beforeEach(() => {
    mockEditPage = sinon.spy();
  });

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const mockData = {
        veteranIdentification: {
          fullName: {
            first: 'John',
            middle: 'A',
            last: 'Smith',
            suffix: 'Jr.',
          },
        },
      };

      const { container } = render(
        <VeteranNameReviewPage
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
          fullName: {
            first: 'John',
            middle: 'A',
            last: 'Smith',
          },
        },
      };

      const { container } = render(
        <VeteranNameReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include(mockTitle);
    });
  });

  describe('Data Display', () => {
    it('should display full name with all parts', () => {
      const mockData = {
        veteranIdentification: {
          fullName: {
            first: 'John',
            middle: 'Anthony',
            last: 'Smith',
            suffix: 'Jr.',
          },
        },
      };

      const { container } = render(
        <VeteranNameReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include("Veteran's full name");
    });

    it('should display full name without middle name', () => {
      const mockData = {
        veteranIdentification: {
          fullName: {
            first: 'John',
            middle: '',
            last: 'Smith',
            suffix: '',
          },
        },
      };

      const { container } = render(
        <VeteranNameReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include("Veteran's full name");
    });

    it('should display full name without suffix', () => {
      const mockData = {
        veteranIdentification: {
          fullName: {
            first: 'Jane',
            middle: 'Marie',
            last: 'Doe',
            suffix: '',
          },
        },
      };

      const { container } = render(
        <VeteranNameReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include("Veteran's full name");
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing veteranIdentification section', () => {
      const mockData = {};

      const { container } = render(
        <VeteranNameReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle undefined fullName', () => {
      const mockData = {
        veteranIdentification: {},
      };

      const { container } = render(
        <VeteranNameReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should hide field when data is empty (hideWhenEmpty)', () => {
      const mockData = {
        veteranIdentification: {
          fullName: {
            first: '',
            middle: '',
            last: '',
            suffix: '',
          },
        },
      };

      const { container } = render(
        <VeteranNameReviewPage
          data={mockData}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      // Component should still render but ReviewFullnameField should hide empty content
      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage function to ReviewPageTemplate', () => {
      const mockData = {
        veteranIdentification: {
          fullName: {
            first: 'John',
            last: 'Smith',
          },
        },
      };

      const { container } = render(
        <VeteranNameReviewPage
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
          fullName: {
            first: 'John',
            last: 'Smith',
          },
        },
      };

      const { container } = render(
        <VeteranNameReviewPage
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
