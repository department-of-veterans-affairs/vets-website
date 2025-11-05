/**
 * @module tests/pages/duty-status-details-review.unit.spec
 * @description Unit tests for Duty Status Details review component
 */

import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { DutyStatusDetailsReview } from './duty-status-details-review';

describe('DutyStatusDetailsReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Duty status details';

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const data = {
        dutyStatusDetails: {
          statusDetails: 'Active duty reserve training two weekends per month',
        },
      };
      const { container } = render(
        <DutyStatusDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should display title', () => {
      const data = {
        dutyStatusDetails: {},
      };
      const { container } = render(
        <DutyStatusDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const heading = container.querySelector('h4');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal(mockTitle);
    });

    it('should display edit button', () => {
      const data = {
        dutyStatusDetails: {},
      };
      const { container } = render(
        <DutyStatusDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
      expect(editButton.getAttribute('text')).to.equal('Edit');
    });
  });

  describe('Data Display', () => {
    it('should display status details', () => {
      const data = {
        dutyStatusDetails: {
          statusDetails: 'Active duty reserve training two weekends per month',
        },
      };
      const { container } = render(
        <DutyStatusDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Duty status details');
      expect(text).to.include(
        'Active duty reserve training two weekends per month',
      );
    });
  });

  describe('Missing Data Handling', () => {
    it('should display "Not provided" for missing status details', () => {
      const data = {
        dutyStatusDetails: {
          statusDetails: '',
        },
      };
      const { container } = render(
        <DutyStatusDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle undefined dutyStatusDetails', () => {
      const data = {};
      const { container } = render(
        <DutyStatusDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle null data', () => {
      const data = {
        dutyStatusDetails: null,
      };
      const { container } = render(
        <DutyStatusDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });
  });
});
