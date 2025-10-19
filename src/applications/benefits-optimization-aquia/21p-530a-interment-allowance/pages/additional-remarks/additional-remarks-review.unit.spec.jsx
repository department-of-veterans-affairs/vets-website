/**
 * @module tests/pages/additional-remarks-review.unit.spec
 * @description Unit tests for AdditionalRemarksReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { AdditionalRemarksReviewPage } from './additional-remarks-review';

describe('AdditionalRemarksReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Additional remarks';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <AdditionalRemarksReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <AdditionalRemarksReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Additional remarks');
    });
  });

  describe('Data Display', () => {
    it('should display remarks when provided', () => {
      const data = {
        additionalRemarks: {
          additionalRemarks: 'This is a test remark',
        },
      };

      const { container } = render(
        <AdditionalRemarksReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('This is a test remark');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <AdditionalRemarksReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should render edit button', () => {
      const { container } = render(
        <AdditionalRemarksReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });
});
