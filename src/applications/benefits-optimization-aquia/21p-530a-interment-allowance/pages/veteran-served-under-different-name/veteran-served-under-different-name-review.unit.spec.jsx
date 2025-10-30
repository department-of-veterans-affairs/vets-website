/**
 * @module tests/pages/veteran-served-under-different-name-review.unit.spec
 * @description Unit tests for VeteranServedUnderDifferentNameReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranServedUnderDifferentNameReviewPage } from './veteran-served-under-different-name-review';

describe('VeteranServedUnderDifferentNameReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Previous names';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranServedUnderDifferentNameReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <VeteranServedUnderDifferentNameReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Previous names');
    });
  });

  describe('Data Display', () => {
    it('should display yes answer', () => {
      const data = {
        veteranServedUnderDifferentName: {
          veteranServedUnderDifferentName: 'yes',
        },
      };

      const { container } = render(
        <VeteranServedUnderDifferentNameReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Yes');
    });

    it('should display no answer', () => {
      const data = {
        veteranServedUnderDifferentName: {
          veteranServedUnderDifferentName: 'no',
        },
      };

      const { container } = render(
        <VeteranServedUnderDifferentNameReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('No');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranServedUnderDifferentNameReviewPage
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
        <VeteranServedUnderDifferentNameReviewPage
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
