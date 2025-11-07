/**
 * @module tests/pages/claimant-information-review.unit.spec
 * @description Unit tests for ClaimantInformationReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ClaimantInformationReviewPage } from './claimant-information-review';

describe('ClaimantInformationReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = "Claimant's information";

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <ClaimantInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include("Claimant's information");
    });

    it('should render edit button', () => {
      const { container } = render(
        <ClaimantInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });

  describe('Veteran as Claimant', () => {
    it('should display relationship label for veteran', () => {
      const data = {
        claimantRelationship: {
          relationship: 'veteran',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Veteran (self)');
    });

    it('should display message when veteran is claimant', () => {
      const data = {
        claimantRelationship: {
          relationship: 'veteran',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include(
        'The veteran is filing this claim for themselves',
      );
    });

    it('should not display claimant fields when veteran is claimant', () => {
      const data = {
        claimantRelationship: {
          relationship: 'veteran',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.not.include("Claimant's full name");
      expect(container.textContent).to.not.include("Claimant's date of birth");
      expect(container.textContent).to.not.include(
        "Claimant's Social Security number",
      );
    });
  });

  describe('Non-Veteran Claimant - Relationship Labels', () => {
    it('should display relationship label for spouse', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            last: 'Amidala',
          },
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Spouse');
    });

    it('should display relationship label for child', () => {
      const data = {
        claimantRelationship: {
          relationship: 'child',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Child');
    });

    it('should display relationship label for parent', () => {
      const data = {
        claimantRelationship: {
          relationship: 'parent',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Parent');
    });

    it('should display relationship label for executor', () => {
      const data = {
        claimantRelationship: {
          relationship: 'executor',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include(
        'Executor/Administrator of Estate',
      );
    });

    it('should display relationship label for other', () => {
      const data = {
        claimantRelationship: {
          relationship: 'other',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Other');
    });
  });

  describe('Non-Veteran Claimant - Name Display', () => {
    it('should display claimant full name with all parts', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            middle: 'Naberrie',
            last: 'Amidala',
            suffix: 'Jr.',
          },
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Padmé');
      expect(container.textContent).to.include('Naberrie');
      expect(container.textContent).to.include('Amidala');
      expect(container.textContent).to.include('Jr.');
    });

    it('should display claimant name without middle name or suffix', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Leia',
            last: 'Organa',
          },
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Leia');
      expect(container.textContent).to.include('Organa');
    });
  });

  describe('Non-Veteran Claimant - Personal Information', () => {
    it('should display claimant date of birth', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            last: 'Amidala',
          },
          claimantDOB: '1985-03-15',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('March 15, 1985');
    });

    it('should display claimant SSN', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            last: 'Amidala',
          },
        },
        claimantSSN: {
          claimantSSN: '123-45-6789',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('123-45-6789');
    });
  });

  describe('Non-Veteran Claimant - Address Display', () => {
    it('should display claimant address with all fields', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            last: 'Amidala',
          },
        },
        claimantAddress: {
          claimantAddress: {
            street: '123 Main St',
            street2: 'Apt 4B',
            street3: 'Building C',
            city: 'Portland',
            state: 'OR',
            postalCode: '97201',
          },
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('123 Main St');
      expect(container.textContent).to.include('Apt 4B');
      expect(container.textContent).to.include('Building C');
      expect(container.textContent).to.include('Portland');
      expect(container.textContent).to.include('OR');
      expect(container.textContent).to.include('97201');
    });

    it('should display claimant address without optional fields', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            last: 'Amidala',
          },
        },
        claimantAddress: {
          claimantAddress: {
            street: '456 Oak Ave',
            city: 'Salem',
            state: 'OR',
            postalCode: '97301',
          },
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('456 Oak Ave');
      expect(container.textContent).to.include('Salem');
      expect(container.textContent).to.include('OR');
      expect(container.textContent).to.include('97301');
    });
  });

  describe('Non-Veteran Claimant - Contact Information', () => {
    it('should display all contact information', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            last: 'Amidala',
          },
        },
        claimantContact: {
          claimantPhoneNumber: '555-123-4567',
          claimantMobilePhone: '555-987-6543',
          claimantEmail: 'padme.amidala@naboo.gov',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('555-123-4567');
      expect(container.textContent).to.include('555-987-6543');
      expect(container.textContent).to.include('padme.amidala@naboo.gov');
    });

    it('should display partial contact information', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            last: 'Amidala',
          },
        },
        claimantContact: {
          claimantPhoneNumber: '555-123-4567',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('555-123-4567');
    });
  });

  describe('Complete Non-Veteran Claimant Data', () => {
    it('should display all claimant information fields', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            middle: 'Naberrie',
            last: 'Amidala',
          },
          claimantDOB: '1985-03-15',
        },
        claimantSSN: {
          claimantSSN: '123-45-6789',
        },
        claimantAddress: {
          claimantAddress: {
            street: '123 Main St',
            city: 'Portland',
            state: 'OR',
            postalCode: '97201',
          },
        },
        claimantContact: {
          claimantPhoneNumber: '555-123-4567',
          claimantMobilePhone: '555-987-6543',
          claimantEmail: 'padme.amidala@naboo.gov',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      // Verify all major sections are present
      expect(container.textContent).to.include('Spouse');
      expect(container.textContent).to.include('Padmé');
      expect(container.textContent).to.include('Amidala');
      expect(container.textContent).to.include('March 15, 1985');
      expect(container.textContent).to.include('123-45-6789');
      expect(container.textContent).to.include('123 Main St');
      expect(container.textContent).to.include('555-123-4567');
      expect(container.textContent).to.include('padme.amidala@naboo.gov');
    });
  });

  describe('Empty and Missing Data', () => {
    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ClaimantInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing claimant relationship', () => {
      const data = {
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            last: 'Amidala',
          },
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing claimant information', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Spouse');
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <ClaimantInformationReviewPage
          data={null}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty name object', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {},
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty address object', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantAddress: {
          claimantAddress: {},
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty contact object', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantContact: {},
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <ClaimantInformationReviewPage
          data={{}}
          editPage={customEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });
});
