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
          firstName: 'Boba',
          lastName: 'Fett',
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

      expect(container.textContent).to.include('Boba');
      expect(container.textContent).to.include('Fett');
      expect(container.textContent).to.include('March 22, 1985');
    });

    it('should display veteran information separately', () => {
      const data = {
        veteranInformation: {
          firstName: 'Jango',
          lastName: 'Fett',
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

      expect(container.textContent).to.include('Jango');
      expect(container.textContent).to.include('Fett');
      expect(container.textContent).to.include('January 6, 1958');
    });

    it('should display first and last name', () => {
      const data = {
        veteranInformation: {
          firstName: 'Cad',
          lastName: 'Bane',
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

      expect(container.textContent).to.include('Cad');
      expect(container.textContent).to.include('Bane');
      expect(container.textContent).to.include('July 13, 1962');
    });

    it('should display all veteran information when all present', () => {
      const data = {
        veteranInformation: {
          firstName: 'Bossk',
          lastName: 'Trandoshan',
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

      expect(container.textContent).to.include('Bossk');
      expect(container.textContent).to.include('Trandoshan');
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

      expect(container.textContent).to.include('first or given name');
      expect(container.textContent).to.include('last or family name');
      expect(container.textContent).to.include('date of birth');
    });
  });

  describe('Missing Data Handling', () => {
    it('should show not provided for missing firstName', () => {
      const data = {
        veteranInformation: {},
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const firstNameRow = reviewRows[0];
      expect(firstNameRow.textContent).to.include('Not provided');
    });

    it('should show not provided for missing date of birth', () => {
      const data = {
        veteranInformation: {
          firstName: 'Boba',
          lastName: 'Fett',
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
      const dobRow = reviewRows[2];
      expect(dobRow.textContent).to.include('Not provided');
    });
  });

  describe('Date Formatting', () => {
    it('should format valid dates correctly', () => {
      const data = {
        veteranInformation: {
          firstName: 'Boba',
          lastName: 'Fett',
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
          firstName: 'Embo',
          lastName: '',
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
          firstName: 'Boba',
          lastName: 'Fett',
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
          firstName: 'Boba',
          lastName: 'Fett',
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
      const dobRow = reviewRows[2];
      expect(dobRow.textContent).to.include('Not provided');
    });

    it('should handle null date', () => {
      const data = {
        veteranInformation: {
          firstName: 'Boba',
          lastName: 'Fett',
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
      const dobRow = reviewRows[2];
      expect(dobRow.textContent).to.include('Not provided');
    });
  });

  describe('Name Display', () => {
    it('should display first name only', () => {
      const data = {
        veteranInformation: {
          firstName: 'Greedo',
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

    it('should display last name only', () => {
      const data = {
        veteranInformation: {
          lastName: 'IG-88',
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

    it('should display both first and last name', () => {
      const data = {
        veteranInformation: {
          firstName: 'Zam',
          lastName: 'Wesell',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Zam');
      expect(container.textContent).to.include('Wesell');
    });

    it('should display complete name information', () => {
      const data = {
        veteranInformation: {
          firstName: 'Aurra',
          lastName: 'Sing',
        },
      };

      const { container } = render(
        <VeteranInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Aurra');
      expect(container.textContent).to.include('Sing');
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

    it('should handle null firstName', () => {
      const data = {
        veteranInformation: {
          firstName: null,
          lastName: null,
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
          firstName: 'Boba',
          lastName: 'Fett',
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
      expect(reviewRows).to.have.lengthOf(3);
    });

    it('should have dt and dd elements for each row', () => {
      const data = {
        veteranInformation: {
          firstName: 'Boba',
          lastName: 'Fett',
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
          firstName: 'Aurra',
          lastName: 'Sing',
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

      expect(container.textContent).to.include('Aurra');
      expect(container.textContent).to.include('Sing');
      expect(container.textContent).to.include('May 20, 1983');
    });

    it('should display profile for Greedo', () => {
      const data = {
        veteranInformation: {
          firstName: 'Greedo',
          lastName: 'Rodian',
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

      expect(container.textContent).to.include('Greedo');
      expect(container.textContent).to.include('Rodian');
      expect(container.textContent).to.include('August 19, 1968');
    });
  });
});
