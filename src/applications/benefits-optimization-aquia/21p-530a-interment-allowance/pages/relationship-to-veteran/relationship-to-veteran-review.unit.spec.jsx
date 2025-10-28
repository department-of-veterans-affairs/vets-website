/**
 * @module tests/pages/relationship-to-veteran-review.unit.spec
 * @description Unit tests for RelationshipToVeteranReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { RelationshipToVeteranReviewPage } from './relationship-to-veteran-review';

describe('RelationshipToVeteranReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Relationship to the Veteran';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <RelationshipToVeteranReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <RelationshipToVeteranReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Relationship to the Veteran');
    });
  });

  describe('Data Display', () => {
    it('should display state cemetery answer', () => {
      const data = {
        relationshipToVeteran: {
          relationshipToVeteran: 'state_cemetery',
        },
      };

      const { container } = render(
        <RelationshipToVeteranReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include("I'm from a state cemetery");
    });

    it('should display tribal organization answer', () => {
      const data = {
        relationshipToVeteran: {
          relationshipToVeteran: 'tribal_organization',
        },
      };

      const { container } = render(
        <RelationshipToVeteranReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include(
        "I'm from a tribal organization",
      );
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <RelationshipToVeteranReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing section data gracefully', () => {
      const data = {
        relationshipToVeteran: {},
      };

      const { container } = render(
        <RelationshipToVeteranReviewPage
          data={data}
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
        <RelationshipToVeteranReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });

  describe('Label Display', () => {
    it('should display question label', () => {
      const data = {
        relationshipToVeteran: {
          relationshipToVeteran: 'state_cemetery',
        },
      };

      const { container } = render(
        <RelationshipToVeteranReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include(
        'What is your relationship to the Veteran?',
      );
    });
  });
});
