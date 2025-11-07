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
    it('should display current duty status', () => {
      const data = {
        dutyStatusDetails: {
          currentDutyStatus:
            'Active duty reserve training two weekends per month',
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
      expect(text).to.include('current duty status');
      expect(text).to.include(
        'Active duty reserve training two weekends per month',
      );
    });

    it('should display disabilities prevent duties as Yes', () => {
      const data = {
        dutyStatusDetails: {
          disabilitiesPreventDuties: 'yes',
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
      expect(text).to.include('disabilities that prevent');
      expect(text).to.include('Yes');
    });

    it('should display disabilities prevent duties as No', () => {
      const data = {
        dutyStatusDetails: {
          disabilitiesPreventDuties: 'no',
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
      expect(text).to.include('No');
    });

    it('should use veteran name in labels', () => {
      const data = {
        veteranInformation: {
          firstName: 'Boba',
          lastName: 'Fett',
        },
        dutyStatusDetails: {
          currentDutyStatus: 'Active reserve',
          disabilitiesPreventDuties: 'no',
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
      expect(text).to.include('Boba Fett');
    });

    it('should use "the Veteran" when no name provided', () => {
      const data = {
        dutyStatusDetails: {
          currentDutyStatus: 'Active reserve',
          disabilitiesPreventDuties: 'no',
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
      expect(text).to.include('the Veteran');
    });
  });

  describe('Missing Data Handling', () => {
    it('should display "Not provided" for missing current duty status', () => {
      const data = {
        dutyStatusDetails: {
          currentDutyStatus: '',
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

    it('should display "Not provided" for missing disabilities prevent duties', () => {
      const data = {
        dutyStatusDetails: {
          disabilitiesPreventDuties: '',
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
