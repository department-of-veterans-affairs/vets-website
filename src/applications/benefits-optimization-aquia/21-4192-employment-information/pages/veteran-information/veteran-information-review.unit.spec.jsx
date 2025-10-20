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
            first: 'James',
            middle: 'Tiberius',
            last: 'Kirk',
          },
          ssn: '123-45-6789',
          vaFileNumber: '12345678',
          dateOfBirth: '2233-03-22',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('James Tiberius Kirk');
      expect(container.textContent).to.include('123-45-6789');
      expect(container.textContent).to.include('12345678');
      expect(container.textContent).to.include('March 22, 2233');
    });

    it('should display veteran information without middle name', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Spock',
            last: 'Vulcan',
          },
          ssn: '987-65-4321',
          dateOfBirth: '2230-01-06',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Spock Vulcan');
      expect(container.textContent).to.include('987-65-4321');
      expect(container.textContent).to.include('January 6, 2230');
    });

    it('should display veteran with suffix', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Jean-Luc',
            last: 'Picard',
            suffix: 'Sr.',
          },
          ssn: '111-22-3333',
          dateOfBirth: '2305-07-13',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Jean-Luc Picard Sr.');
      expect(container.textContent).to.include('111-22-3333');
      expect(container.textContent).to.include('July 13, 2305');
    });

    it('should display all name components when all present', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Benjamin',
            middle: 'Lafayette',
            last: 'Sisko',
            suffix: 'Jr.',
          },
          ssn: '222-33-4444',
          dateOfBirth: '2332-05-02',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Benjamin Lafayette Sisko Jr.');
      expect(container.textContent).to.include('222-33-4444');
      expect(container.textContent).to.include('May 2, 2332');
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

      expect(container.textContent).to.include("Veteran's full name");
      expect(container.textContent).to.include('Social Security number');
      expect(container.textContent).to.include('VA file number');
      expect(container.textContent).to.include('Date of birth');
    });
  });

  describe('Missing Data Handling', () => {
    it('should show not provided for missing name', () => {
      const data = {
        veteranInformation: {
          fullName: {},
          ssn: '123-45-6789',
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

    it('should show not provided for missing SSN', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'James', last: 'Kirk' },
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
      const ssnRow = reviewRows[1];
      expect(ssnRow.textContent).to.include('Not provided');
    });

    it('should show not provided for missing VA file number', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'James', last: 'Kirk' },
          ssn: '123-45-6789',
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
      const vaFileRow = reviewRows[2];
      expect(vaFileRow.textContent).to.include('Not provided');
    });

    it('should show not provided for missing date of birth', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'James', last: 'Kirk' },
          ssn: '123-45-6789',
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
      const dobRow = reviewRows[3];
      expect(dobRow.textContent).to.include('Not provided');
    });
  });

  describe('Date Formatting', () => {
    it('should format valid dates correctly', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'James', last: 'Kirk' },
          dateOfBirth: '2233-03-22',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('March 22, 2233');
    });

    it('should handle different date formats', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Leonard', last: 'McCoy' },
          dateOfBirth: '2227-01-20',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('January 20, 2227');
    });

    it('should handle invalid date strings', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'James', last: 'Kirk' },
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

      // Should display the original string or "Not provided"
      expect(container).to.exist;
    });

    it('should handle empty date string', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'James', last: 'Kirk' },
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
      const dobRow = reviewRows[3];
      expect(dobRow.textContent).to.include('Not provided');
    });

    it('should handle null date', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'James', last: 'Kirk' },
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
      const dobRow = reviewRows[3];
      expect(dobRow.textContent).to.include('Not provided');
    });
  });

  describe('Name Formatting', () => {
    it('should format first name only', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Worf',
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

      expect(container.textContent).to.include('Worf');
    });

    it('should format last name only', () => {
      const data = {
        veteranInformation: {
          fullName: {
            last: 'Data',
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

      expect(container.textContent).to.include('Data');
    });

    it('should skip empty name parts', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Nyota',
            middle: '',
            last: 'Uhura',
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

      expect(container.textContent).to.include('Nyota Uhura');
      // Should not have extra spaces
      expect(container.textContent).to.not.include('  ');
    });

    it('should handle null name parts', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Hikaru',
            middle: null,
            last: 'Sulu',
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

      expect(container.textContent).to.include('Hikaru Sulu');
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
          fullName: { first: 'James', last: 'Kirk' },
          ssn: '123-45-6789',
          vaFileNumber: '12345678',
          dateOfBirth: '2233-03-22',
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
      expect(reviewRows).to.have.lengthOf(4);
    });

    it('should have dt and dd elements for each row', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'James', last: 'Kirk' },
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
    it('should display profile for Kathryn Janeway', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Kathryn',
            last: 'Janeway',
          },
          ssn: '555-66-7777',
          vaFileNumber: '87654321',
          dateOfBirth: '2336-05-20',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Kathryn Janeway');
      expect(container.textContent).to.include('555-66-7777');
      expect(container.textContent).to.include('87654321');
      expect(container.textContent).to.include('May 20, 2336');
    });

    it('should display profile for William Riker', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'William',
            middle: 'Thomas',
            last: 'Riker',
          },
          ssn: '999-88-7777',
          dateOfBirth: '2335-08-19',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('William Thomas Riker');
      expect(container.textContent).to.include('999-88-7777');
      expect(container.textContent).to.include('August 19, 2335');
    });
  });
});
