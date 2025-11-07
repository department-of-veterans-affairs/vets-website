/**
 * @module tests/pages/employment-concessions-review.unit.spec
 * @description Unit tests for Employment Concessions review component
 */

import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { EmploymentConcessionsReview } from './employment-concessions-review';

describe('EmploymentConcessionsReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Concessions';

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const data = {
        concessions: 'Modified duty schedule',
      };
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should display concessions text', () => {
      const data = {
        employmentConcessions: {
          concessions: 'Flexible duty shifts due to medical needs',
        },
      };
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Flexible duty shifts due to medical needs');
    });

    it('should display themed concessions', () => {
      const data = {
        employmentConcessions: {
          concessions: 'Reduced bridge duty hours accommodating rehabilitation',
        },
      };
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include(
        'Reduced bridge duty hours accommodating rehabilitation',
      );
    });
  });

  describe('Data Formatting', () => {
    it('should handle empty concessions', () => {
      const data = {
        employmentConcessions: {
          concessions: '',
        },
      };
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle long concessions text', () => {
      const data = {
        employmentConcessions: {
          concessions: 'A'.repeat(1000),
        },
      };
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('A'.repeat(1000));
    });

    it('should preserve line breaks in concessions', () => {
      const data = {
        employmentConcessions: {
          concessions: 'First line\nSecond line\nThird line',
        },
      };
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });
  });

  describe('Missing Data Handling', () => {
    it('should handle undefined data', () => {
      const { container } = render(
        <EmploymentConcessionsReview
          data={undefined}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle null data', () => {
      const { container } = render(
        <EmploymentConcessionsReview
          data={null}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle missing concessions field', () => {
      const data = {};
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should accept editPage prop', () => {
      const data = {
        concessions: 'Modified schedule',
      };
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should work without editPage prop', () => {
      const data = {
        concessions: 'Modified schedule',
      };
      const { container } = render(
        <EmploymentConcessionsReview data={data} title={mockTitle} />,
      );
      expect(container).to.exist;
    });
  });

  describe('Additional Test Cases', () => {
    it('should display Guild disability accommodation', () => {
      const data = {
        employmentConcessions: {
          concessions:
            'Allowed to perform duties from medical bay workstation when needed',
        },
      };
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include(
        'Allowed to perform duties from medical bay workstation when needed',
      );
    });

    it('should display multiple concessions', () => {
      const data = {
        employmentConcessions: {
          concessions:
            'Modified duty schedule, Reduced physical training requirements, Additional rest periods',
        },
      };
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Modified duty schedule');
    });

    it('should use correct tense for currently employed', () => {
      const data = {
        employmentDates: {
          currentlyEmployed: true,
        },
        employmentConcessions: {
          concessions: 'Flexible schedule',
        },
      };
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('What concessions');
      expect(text).to.include('are made');
    });

    it('should use correct tense for not currently employed', () => {
      const data = {
        employmentDates: {
          currentlyEmployed: false,
        },
        employmentConcessions: {
          concessions: 'Flexible schedule',
        },
      };
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('What concessions');
      expect(text).to.include('were made');
    });

    it('should use veteran name in label', () => {
      const data = {
        veteranInformation: {
          firstName: 'Boba',
          lastName: 'Fett',
        },
        employmentConcessions: {
          concessions: 'Flexible schedule',
        },
      };
      const { container } = render(
        <EmploymentConcessionsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Boba Fett');
    });
  });
});
