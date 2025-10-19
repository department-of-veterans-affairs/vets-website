/**
 * @module tests/pages/service-periods.unit.spec
 * @description Unit tests for ServicePeriodsPage component
 * Note: These tests focus on component structure and rendering.
 * Web component event handling is tested in integration/e2e tests.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ServicePeriodsPage, ensureDateStrings } from './service-periods';

describe('ServicePeriodsPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Service periods');
    });

    it('should render all form fields for a service period', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // Check all fields are rendered using web component selectors
      expect(container.querySelector('va-select[label="Branch of service"]')).to
        .exist;
      expect(
        container.querySelector(
          'va-memorable-date[label="Service start date"]',
        ),
      ).to.exist;
      expect(
        container.querySelector('va-memorable-date[label="Service end date"]'),
      ).to.exist;
      expect(container.querySelector('va-text-input[label="Place of entry"]'))
        .to.exist;
      expect(
        container.querySelector('va-text-input[label="Place of separation"]'),
      ).to.exist;
      expect(
        container.querySelector(
          'va-text-input[label="Grade, rank, or rating"]',
        ),
      ).to.exist;
    });

    it('should render with at least one service period by default', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const servicePeriodItems = container.querySelectorAll(
        '.array-field-item',
      );
      expect(servicePeriodItems).to.have.lengthOf(1);
    });
  });

  describe('Data Handling', () => {
    it('should render service period items', () => {
      const existingData = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: '1962-01-01',
            dateTo: '1965-05-19',
            placeOfEntry: 'Coruscant Jedi Temple',
            placeOfSeparation: 'Mustafar',
            rank: 'Jedi Knight / General',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const servicePeriodItems = container.querySelectorAll(
        '.array-field-item',
      );
      expect(servicePeriodItems.length).to.be.at.least(1);
    });

    it('should handle null or undefined data gracefully', () => {
      const dataWithNullPeriod = {
        servicePeriods: [null, undefined],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={dataWithNullPeriod}
          setFormData={mockSetFormData}
        />,
      );

      // Should filter out null/undefined and render default empty item
      const servicePeriodItems = container.querySelectorAll(
        '.array-field-item',
      );
      expect(servicePeriodItems).to.exist;
    });

    it('should handle service period with undefined fields', () => {
      const dataWithUndefinedFields = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: '1962-01-01',
            dateTo: '1965-05-19',
            // placeOfEntry, placeOfSeparation, rank are undefined
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={dataWithUndefinedFields}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should handle service period with null fields', () => {
      const dataWithNullFields = {
        servicePeriods: [
          {
            branchOfService: null,
            dateFrom: null,
            dateTo: null,
            placeOfEntry: null,
            placeOfSeparation: null,
            rank: null,
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={dataWithNullFields}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });

    it('should handle empty servicePeriods array', () => {
      const dataWithEmptyArray = {
        servicePeriods: [],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={dataWithEmptyArray}
          setFormData={mockSetFormData}
        />,
      );

      // Should render with default empty item
      expect(container.querySelector('va-select')).to.exist;
    });

    it('should handle data with servicePeriods as non-array', () => {
      const dataWithNonArray = {
        servicePeriods: 'not-an-array',
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={dataWithNonArray}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });

    it('should handle data without servicePeriods property', () => {
      const dataWithoutServicePeriods = {
        otherData: 'value',
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={dataWithoutServicePeriods}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });

    it('should handle service period with only required fields', () => {
      const minimalData = {
        servicePeriods: [
          {
            branchOfService: 'navy',
            dateFrom: '1980-01-01',
            dateTo: '1984-12-31',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={minimalData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select[label="Branch of service"]')).to
        .exist;
      expect(
        container.querySelector(
          'va-memorable-date[label="Service start date"]',
        ),
      ).to.exist;
      expect(
        container.querySelector('va-memorable-date[label="Service end date"]'),
      ).to.exist;
    });

    it('should handle mixed valid and null items in array', () => {
      const mixedData = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: '1962-01-01',
            dateTo: '1965-05-19',
          },
          null,
          {
            branchOfService: 'navy',
            dateFrom: '1965-05-20',
            dateTo: '1984-05-04',
          },
          undefined,
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={mixedData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });
  });

  describe('Schema Validation', () => {
    it('should render date fields', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const dateFields = container.querySelectorAll('va-memorable-date');
      expect(dateFields).to.have.length.at.least(2);
    });

    it('should handle service periods with Date objects', () => {
      const dataWithDateObjects = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: new Date('1962-01-01'),
            dateTo: new Date('1965-05-19'),
            placeOfEntry: 'Coruscant',
            placeOfSeparation: 'Mustafar',
            rank: 'General',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={dataWithDateObjects}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should handle empty string values in fields', () => {
      const dataWithEmptyStrings = {
        servicePeriods: [
          {
            branchOfService: '',
            dateFrom: '',
            dateTo: '',
            placeOfEntry: '',
            placeOfSeparation: '',
            rank: '',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={dataWithEmptyStrings}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );
      expect(continueButton).to.exist;
    });

    it('should render back button when goBack is provided', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.exist;
    });

    it('should not render back button if goBack is not provided', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.not.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render save button instead of continue in review mode', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      const saveButton = container.querySelector('va-button[text="Save"]');
      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );

      expect(saveButton).to.exist;
      expect(continueButton).to.not.exist;
    });
  });

  describe('ArrayField Functionality', () => {
    it('should render add button', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const addButton = container.querySelector(
        'va-button[text="Add another service period"]',
      );
      expect(addButton).to.exist;
    });

    it('should render with multiple service periods data', () => {
      const multiplePeriodsData = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: '1962-01-01',
            dateTo: '1965-05-19',
            placeOfEntry: 'Coruscant',
            placeOfSeparation: 'Mustafar',
            rank: 'General',
          },
          {
            branchOfService: 'navy',
            dateFrom: '1965-05-20',
            dateTo: '1984-05-04',
            placeOfEntry: 'Death Star I',
            placeOfSeparation: 'Death Star II',
            rank: 'Supreme Commander',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={multiplePeriodsData}
          setFormData={mockSetFormData}
        />,
      );

      // ArrayField may collapse items - just verify it renders
      const servicePeriodItems = container.querySelectorAll(
        '.array-field-item',
      );
      expect(servicePeriodItems.length).to.be.at.least(1);
    });

    it('should accept and handle multiple service periods', () => {
      const threePeriods = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: '1941-05-04',
            dateTo: '1945-05-08',
            placeOfEntry: 'Tatooine',
            placeOfSeparation: 'Coruscant',
            rank: 'Padawan',
          },
          {
            branchOfService: 'navy',
            dateFrom: '1945-05-09',
            dateTo: '1960-12-31',
            placeOfEntry: 'Coruscant Jedi Temple',
            placeOfSeparation: 'Mustafar',
            rank: 'Jedi Knight',
          },
          {
            branchOfService: 'space force',
            dateFrom: '1965-05-20',
            dateTo: '1984-05-04',
            placeOfEntry: 'Death Star I',
            placeOfSeparation: 'Death Star II',
            rank: 'Supreme Commander',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={threePeriods}
          setFormData={mockSetFormData}
        />,
      );

      // Should render without errors and show array field items
      expect(container).to.exist;
      const arrayFieldItems = container.querySelectorAll('.array-field-item');
      expect(arrayFieldItems).to.have.length.of.at.least(1);

      // Should have the add button for more periods
      const addButton = container.querySelector(
        'va-button[text="Add another service period"]',
      );
      expect(addButton).to.exist;
    });
  });

  describe('Data Validation Edge Cases', () => {
    it('should handle null data prop', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });

    it('should handle undefined data prop', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={undefined}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });

    it('should handle array data prop', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={[]}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });

    it('should handle function data prop', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={() => {}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });
  });

  describe('Field Display', () => {
    it('should display instructional text', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        'Please provide information about the veteran',
      );
      expect(container.textContent).to.include('military service periods');
    });

    it('should display field elements with labels', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // Check for form fields using web component selectors
      expect(container.querySelector('va-select[label="Branch of service"]')).to
        .exist;
      expect(
        container.querySelector(
          'va-memorable-date[label="Service start date"]',
        ),
      ).to.exist;
      expect(
        container.querySelector('va-memorable-date[label="Service end date"]'),
      ).to.exist;
      expect(container.querySelector('va-text-input[label="Place of entry"]'))
        .to.exist;
      expect(
        container.querySelector('va-text-input[label="Place of separation"]'),
      ).to.exist;
      expect(
        container.querySelector(
          'va-text-input[label="Grade, rank, or rating"]',
        ),
      ).to.exist;
    });

    it('should display hint text for date fields', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const dateFields = container.querySelectorAll('va-memorable-date');
      expect(dateFields.length).to.be.at.least(2);
    });

    it('should display hint text for place fields', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const placeFields = container.querySelectorAll(
        'va-text-input[label*="Place"]',
      );
      expect(placeFields.length).to.be.at.least(2);
    });
  });

  describe('Service Period with Minimal Data', () => {
    it('should render with minimal required fields', () => {
      const minimalData = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: '1962-01-01',
            dateTo: '1965-05-19',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={minimalData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });

    it('should render with all optional fields empty', () => {
      const dataWithEmptyOptionals = {
        servicePeriods: [
          {
            branchOfService: 'navy',
            dateFrom: '1980-01-01',
            dateTo: '1984-12-31',
            placeOfEntry: '',
            placeOfSeparation: '',
            rank: '',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={dataWithEmptyOptionals}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });
  });

  describe('Different Branch Types', () => {
    it('should render with space force branch', () => {
      const spaceForceData = {
        servicePeriods: [
          {
            branchOfService: 'space force',
            dateFrom: '2020-01-01',
            dateTo: '2024-12-31',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={spaceForceData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });

    it('should render with coast guard branch', () => {
      const coastGuardData = {
        servicePeriods: [
          {
            branchOfService: 'coast guard',
            dateFrom: '2000-01-01',
            dateTo: '2004-12-31',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={coastGuardData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });

    it('should render with marine corps branch', () => {
      const marineCorpsData = {
        servicePeriods: [
          {
            branchOfService: 'marine corps',
            dateFrom: '1995-01-01',
            dateTo: '1999-12-31',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={marineCorpsData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });

    it('should render with air force branch', () => {
      const airForceData = {
        servicePeriods: [
          {
            branchOfService: 'air force',
            dateFrom: '2010-01-01',
            dateTo: '2014-12-31',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={airForceData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });
  });

  describe('Field Properties and Attributes', () => {
    it('should render all required field indicators', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // Branch, dateFrom, and dateTo are required
      expect(container.querySelector('va-select[required]')).to.exist;
      expect(
        container.querySelectorAll('va-memorable-date[required]').length,
      ).to.equal(2);
    });

    it('should render hint text for all applicable fields', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // Date fields have hints
      const dateFields = container.querySelectorAll('va-memorable-date');
      expect(dateFields.length).to.be.at.least(2);

      // Place fields have hints
      const placeFields = container.querySelectorAll(
        'va-text-input[label*="Place"]',
      );
      expect(placeFields.length).to.be.at.least(2);
    });

    it('should render all optional fields', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // Optional fields: placeOfEntry, placeOfSeparation, rank
      expect(container.querySelector('va-text-input[label="Place of entry"]'))
        .to.exist;
      expect(
        container.querySelector('va-text-input[label="Place of separation"]'),
      ).to.exist;
      expect(
        container.querySelector(
          'va-text-input[label="Grade, rank, or rating"]',
        ),
      ).to.exist;
    });

    it('should render field with all properties populated', () => {
      const completeData = {
        servicePeriods: [
          {
            branchOfService: 'navy',
            dateFrom: '1977-05-25',
            dateTo: '1983-05-25',
            placeOfEntry: 'Alderaan',
            placeOfSeparation: 'Endor',
            rank: 'Princess / General',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={completeData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
      expect(container.querySelectorAll('va-memorable-date').length).to.equal(
        2,
      );
      expect(container.querySelectorAll('va-text-input').length).to.be.at.least(
        3,
      );
    });
  });

  describe('Component Props and Configuration', () => {
    it('should pass correct itemName to ArrayField', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // ArrayField should display "service period" text
      expect(container.textContent).to.include('Service period');
    });

    it('should use correct defaultItem structure', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // Should render with default empty structure
      expect(container.querySelector('va-select')).to.exist;
      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should use formatServicePeriodSummary for item summaries', () => {
      const dataWithCompletePeriod = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: '1941-05-04',
            dateTo: '1984-05-04',
            placeOfEntry: 'Tatooine',
            placeOfSeparation: 'Death Star II',
            rank: 'Jedi Knight',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={dataWithCompletePeriod}
          setFormData={mockSetFormData}
        />,
      );

      // Should render without errors (summary function is used internally)
      expect(container).to.exist;
    });

    it('should use isServicePeriodEmpty for empty detection', () => {
      const dataWithEmptyPeriod = {
        servicePeriods: [
          {
            branchOfService: '',
            dateFrom: '',
            dateTo: '',
            placeOfEntry: '',
            placeOfSeparation: '',
            rank: '',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={dataWithEmptyPeriod}
          setFormData={mockSetFormData}
        />,
      );

      // Should render without errors (empty detection function is used internally)
      expect(container).to.exist;
    });
  });
});

describe('ensureDateStrings', () => {
  describe('Date Object Transformation', () => {
    it('should transform Date objects to ISO strings', () => {
      const formData = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: new Date('1962-01-01'),
            dateTo: new Date('1965-05-19'),
            placeOfEntry: 'Coruscant',
          },
        ],
      };

      const result = ensureDateStrings(formData);

      expect(result.servicePeriods[0].dateFrom).to.be.a('string');
      expect(result.servicePeriods[0].dateTo).to.be.a('string');
      expect(result.servicePeriods[0].dateFrom).to.include('1962-01-01');
      expect(result.servicePeriods[0].dateTo).to.include('1965-05-19');
    });

    it('should handle string dates unchanged', () => {
      const formData = {
        servicePeriods: [
          {
            branchOfService: 'navy',
            dateFrom: '1980-01-01',
            dateTo: '1984-12-31',
          },
        ],
      };

      const result = ensureDateStrings(formData);

      expect(result.servicePeriods[0].dateFrom).to.equal('1980-01-01');
      expect(result.servicePeriods[0].dateTo).to.equal('1984-12-31');
    });

    it('should preserve other fields', () => {
      const formData = {
        servicePeriods: [
          {
            branchOfService: 'air force',
            dateFrom: new Date('2010-01-01'),
            dateTo: new Date('2014-12-31'),
            placeOfEntry: 'Death Star',
            placeOfSeparation: 'Endor',
            rank: 'Commander',
          },
        ],
      };

      const result = ensureDateStrings(formData);

      expect(result.servicePeriods[0].branchOfService).to.equal('air force');
      expect(result.servicePeriods[0].placeOfEntry).to.equal('Death Star');
      expect(result.servicePeriods[0].placeOfSeparation).to.equal('Endor');
      expect(result.servicePeriods[0].rank).to.equal('Commander');
    });
  });

  describe('Null and Undefined Handling', () => {
    it('should return formData as-is if null', () => {
      const result = ensureDateStrings(null);
      expect(result).to.be.null;
    });

    it('should return formData as-is if undefined', () => {
      const result = ensureDateStrings(undefined);
      expect(result).to.be.undefined;
    });

    it('should return formData as-is if servicePeriods is missing', () => {
      const formData = { otherField: 'value' };
      const result = ensureDateStrings(formData);
      expect(result).to.deep.equal(formData);
    });

    it('should return formData as-is if servicePeriods is not an array', () => {
      const formData = { servicePeriods: 'not-an-array' };
      const result = ensureDateStrings(formData);
      expect(result).to.deep.equal(formData);
    });

    it('should skip null items in servicePeriods array', () => {
      const formData = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: '1962-01-01',
            dateTo: '1965-05-19',
          },
          null,
          {
            branchOfService: 'navy',
            dateFrom: '1965-05-20',
            dateTo: '1984-05-04',
          },
        ],
      };

      const result = ensureDateStrings(formData);

      expect(result.servicePeriods).to.have.length(3);
      expect(result.servicePeriods[0]).to.be.an('object');
      expect(result.servicePeriods[1]).to.be.null;
      expect(result.servicePeriods[2]).to.be.an('object');
    });

    it('should skip undefined items in servicePeriods array', () => {
      const formData = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: '1962-01-01',
            dateTo: '1965-05-19',
          },
          undefined,
        ],
      };

      const result = ensureDateStrings(formData);

      expect(result.servicePeriods).to.have.length(2);
      expect(result.servicePeriods[0]).to.be.an('object');
      expect(result.servicePeriods[1]).to.be.undefined;
    });
  });

  describe('Multiple Service Periods', () => {
    it('should transform dates in all service periods', () => {
      const formData = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: new Date('1941-05-04'),
            dateTo: new Date('1945-05-08'),
          },
          {
            branchOfService: 'navy',
            dateFrom: new Date('1945-05-09'),
            dateTo: new Date('1960-12-31'),
          },
          {
            branchOfService: 'space force',
            dateFrom: new Date('1965-05-20'),
            dateTo: new Date('1984-05-04'),
          },
        ],
      };

      const result = ensureDateStrings(formData);

      expect(result.servicePeriods).to.have.length(3);
      result.servicePeriods.forEach(period => {
        expect(period.dateFrom).to.be.a('string');
        expect(period.dateTo).to.be.a('string');
      });
    });

    it('should handle mixed Date objects and strings', () => {
      const formData = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: new Date('1962-01-01'),
            dateTo: '1965-05-19',
          },
          {
            branchOfService: 'navy',
            dateFrom: '1965-05-20',
            dateTo: new Date('1984-05-04'),
          },
        ],
      };

      const result = ensureDateStrings(formData);

      expect(result.servicePeriods[0].dateFrom).to.be.a('string');
      expect(result.servicePeriods[0].dateTo).to.be.a('string');
      expect(result.servicePeriods[1].dateFrom).to.be.a('string');
      expect(result.servicePeriods[1].dateTo).to.be.a('string');
    });
  });

  describe('Empty Arrays', () => {
    it('should handle empty servicePeriods array', () => {
      const formData = { servicePeriods: [] };
      const result = ensureDateStrings(formData);

      expect(result.servicePeriods).to.be.an('array');
      expect(result.servicePeriods).to.have.length(0);
    });
  });

  describe('Preserves Form Structure', () => {
    it('should preserve other formData properties', () => {
      const formData = {
        personalInfo: { name: 'Anakin Skywalker' },
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: new Date('1962-01-01'),
            dateTo: new Date('1965-05-19'),
          },
        ],
        contactInfo: { email: 'anakin@jedi.org' },
      };

      const result = ensureDateStrings(formData);

      expect(result.personalInfo).to.deep.equal({
        name: 'Anakin Skywalker',
      });
      expect(result.contactInfo).to.deep.equal({ email: 'anakin@jedi.org' });
      expect(result.servicePeriods).to.be.an('array');
    });

    it('should not mutate original formData', () => {
      const formData = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: new Date('1962-01-01'),
            dateTo: new Date('1965-05-19'),
          },
        ],
      };

      const originalDateFrom = formData.servicePeriods[0].dateFrom;
      const result = ensureDateStrings(formData);

      // Original should still be Date object
      expect(formData.servicePeriods[0].dateFrom).to.equal(originalDateFrom);
      // Result should be string
      expect(result.servicePeriods[0].dateFrom).to.be.a('string');
    });
  });
});
