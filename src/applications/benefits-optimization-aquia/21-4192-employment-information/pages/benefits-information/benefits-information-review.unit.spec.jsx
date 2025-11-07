/**
 * @module tests/reviews/benefits-information-review.unit.spec
 * @description Unit tests for BenefitsInformationReview component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { BenefitsInformationReview } from './benefits-information-review';

describe('BenefitsInformationReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Benefits information';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <BenefitsInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <BenefitsInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Benefits information');
    });

    it('should show not provided when no benefits information', () => {
      const { container } = render(
        <BenefitsInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Data Display', () => {
    it('should display Yes for Guild benefits entitlement', () => {
      const data = {
        benefitsInformation: {
          benefitEntitlement: 'yes',
        },
      };

      const { container } = render(
        <BenefitsInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Yes');
    });

    it('should display No for benefits entitlement', () => {
      const data = {
        benefitsInformation: {
          benefitEntitlement: 'no',
        },
      };

      const { container } = render(
        <BenefitsInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('No');
    });
  });

  describe('Edit Functionality', () => {
    it('should render edit button', () => {
      const { container } = render(
        <BenefitsInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
      expect(editButton.getAttribute('text')).to.equal('Edit');
    });
  });

  describe('Missing Data Handling', () => {
    it('should show not provided for empty entitlement', () => {
      const data = {
        benefitsInformation: {
          benefitEntitlement: '',
        },
      };

      const { container } = render(
        <BenefitsInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Dynamic Names Display', () => {
    it('should use veteran name in label', () => {
      const data = {
        veteranInformation: {
          firstName: 'Boba',
          lastName: 'Fett',
        },
        benefitsInformation: {
          benefitEntitlement: 'yes',
        },
      };

      const { container } = render(
        <BenefitsInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Boba Fett');
    });

    it('should use employer name in label', () => {
      const data = {
        employerInformation: {
          employerName: 'Bounty Hunters Guild',
        },
        benefitsInformation: {
          benefitEntitlement: 'yes',
        },
      };

      const { container } = render(
        <BenefitsInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Bounty Hunters Guild');
    });

    it('should use "the Veteran" and "you" when names not provided', () => {
      const data = {
        benefitsInformation: {
          benefitEntitlement: 'yes',
        },
      };

      const { container } = render(
        <BenefitsInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('the Veteran');
      expect(container.textContent).to.include('you');
    });
  });
});
