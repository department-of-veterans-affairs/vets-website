/**
 * @module tests/reviews/veteran-information-review.unit.spec
 * @description Unit tests for VeteranInformationReview component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranInformationReview } from './veteran-information-review';

describe('VeteranInformationReview', () => {
  const mockEditPage = () => {};
  const mockTitle = "Veteran's information";

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <VeteranInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include("Veteran's information");
    });

    it('should show not provided when no veteran information', () => {
      const { container } = render(
        <VeteranInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Data Display', () => {
    it('should display complete veteran information', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Boba',
            middle: '',
            last: 'Fett',
          },
          dateOfBirth: '1985-03-22',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Boba Fett');
      expect(container.textContent).to.include('March 22, 1985');
    });

    it('should display veteran information without middle name', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Jango',
            last: 'Fett',
          },
          dateOfBirth: '1958-01-06',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Jango Fett');
      expect(container.textContent).to.include('January 6, 1958');
    });

    it('should display veteran with suffix', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Cad',
            last: 'Bane',
            suffix: '',
          },
          dateOfBirth: '1962-07-13',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Cad Bane');
      expect(container.textContent).to.include('July 13, 1962');
    });

    it('should display all name components when all present', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Bossk',
            middle: '',
            last: 'Trandoshan',
            suffix: '',
          },
          dateOfBirth: '1971-05-02',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Bossk Trandoshan');
      expect(container.textContent).to.include('May 2, 1971');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranInformationReview
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
        <VeteranInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
      expect(editButton.getAttribute('text')).to.equal('Edit');
    });

    it('should have secondary button style', () => {
      const { container } = render(
        <VeteranInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton.hasAttribute('secondary')).to.be.true;
    });

    it('should use uswds style', () => {
      const { container } = render(
        <VeteranInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton.hasAttribute('uswds')).to.be.true;
    });
  });

  describe('Field Labels', () => {
    it('should display all field labels', () => {
      const { container } = render(
        <VeteranInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.match(/Veteran.s full name/);
      expect(container.textContent).to.include('Date of birth');
    });
  });

  describe('Missing Data Handling', () => {
    it('should show not provided for missing name', () => {
      const data = {
        veteranInformation: {
          fullName: {},
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const nameRow = reviewRows[0];
      expect(nameRow.textContent).to.include('Not provided');
    });

    it('should show not provided for missing date of birth', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Boba', last: 'Fett' },
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const dobRow = reviewRows[1];
      expect(dobRow.textContent).to.include('Not provided');
    });
  });

  describe('Date Formatting', () => {
    it('should format valid dates correctly', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Boba', last: 'Fett' },
          dateOfBirth: '1985-03-22',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('March 22, 1985');
    });

    it('should handle different date formats', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Embo', last: '' },
          dateOfBirth: '1955-01-20',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('January 20, 1955');
    });

    it('should handle invalid date strings', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Boba', last: 'Fett' },
          dateOfBirth: 'invalid-date',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty date string', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Boba', last: 'Fett' },
          dateOfBirth: '',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const dobRow = reviewRows[1];
      expect(dobRow.textContent).to.include('Not provided');
    });

    it('should handle null date', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Boba', last: 'Fett' },
          dateOfBirth: null,
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const dobRow = reviewRows[1];
      expect(dobRow.textContent).to.include('Not provided');
    });
  });

  describe('Name Formatting', () => {
    it('should format first name only', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Greedo',
          },
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Greedo');
    });

    it('should format last name only', () => {
      const data = {
        veteranInformation: {
          fullName: {
            last: 'IG-88',
          },
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('IG-88');
    });

    it('should skip empty name parts', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Zam',
            middle: '',
            last: 'Wesell',
            suffix: '',
          },
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Zam Wesell');
      expect(container.textContent).to.not.include('  ');
    });

    it('should handle null name parts', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Aurra',
            middle: null,
            last: 'Sing',
            suffix: null,
          },
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Aurra Sing');
    });
  });

  describe('Data Structure Variations', () => {
    it('should handle missing veteranInformation object', () => {
      const data = {};

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null veteranInformation', () => {
      const data = {
        veteranInformation: null,
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle undefined data.veteranInformation', () => {
      const data = {
        veteranInformation: undefined,
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null fullName', () => {
      const data = {
        veteranInformation: {
          fullName: null,
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Review Row Structure', () => {
    it('should have correct number of review rows', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Boba', last: 'Fett' },
          dateOfBirth: '1985-03-22',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      expect(reviewRows).to.have.lengthOf(2);
    });

    it('should have dt and dd elements for each row', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Boba', last: 'Fett' },
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      reviewRows.forEach(row => {
        expect(row.querySelector('dt')).to.exist;
        expect(row.querySelector('dd')).to.exist;
      });
    });
  });

  describe('CSS Classes', () => {
    it('should have correct container class', () => {
      const { container } = render(
        <VeteranInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.querySelector('.form-review-panel-page')).to.exist;
    });

    it('should have review class on dl element', () => {
      const { container } = render(
        <VeteranInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.querySelector('dl.review')).to.exist;
    });
  });

  describe('Different Veteran Profiles', () => {
    it('should display profile for Aurra Sing', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Aurra',
            last: 'Sing',
          },
          dateOfBirth: '1983-05-20',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Aurra Sing');
      expect(container.textContent).to.include('May 20, 1983');
    });

    it('should display profile for Greedo', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Greedo',
            last: 'Rodian',
          },
          dateOfBirth: '1968-08-19',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Greedo Rodian');
      expect(container.textContent).to.include('August 19, 1968');
    });
  });
});
