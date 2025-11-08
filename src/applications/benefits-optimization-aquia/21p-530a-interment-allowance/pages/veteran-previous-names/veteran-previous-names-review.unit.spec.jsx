/**
 * @module tests/pages/veteran-previous-names-review.unit.spec
 * @description Unit tests for VeteranPreviousNamesReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranPreviousNamesReviewPage } from './veteran-previous-names-review';

describe('VeteranPreviousNamesReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Previous names';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranPreviousNamesReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <VeteranPreviousNamesReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Previous names');
    });
  });

  describe('Data Display', () => {
    it('should display previous names', () => {
      const data = {
        previousNames: [
          {
            first: 'Darth',
            middle: '',
            last: 'Vader',
          },
        ],
      };

      const { container } = render(
        <VeteranPreviousNamesReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Darth');
      expect(container.textContent).to.include('Vader');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranPreviousNamesReviewPage
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
        <VeteranPreviousNamesReviewPage
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
