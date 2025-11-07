/**
 * @module tests/reviews/duty-status-review.unit.spec
 * @description Unit tests for DutyStatusReview component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DutyStatusReview } from './duty-status-review';

describe('DutyStatusReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Duty status';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <DutyStatusReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <DutyStatusReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Duty status');
    });

    it('should show not provided when no duty status', () => {
      const { container } = render(
        <DutyStatusReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Data Display', () => {
    it('should display Yes for Reserve/Guard status', () => {
      const data = {
        dutyStatus: {
          reserveOrGuardStatus: 'yes',
        },
      };

      const { container } = render(
        <DutyStatusReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Yes');
    });

    it('should display No for Reserve/Guard status', () => {
      const data = {
        dutyStatus: {
          reserveOrGuardStatus: 'no',
        },
      };

      const { container } = render(
        <DutyStatusReview
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
        <DutyStatusReview
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
    it('should show not provided for empty status', () => {
      const data = {
        dutyStatus: {
          reserveOrGuardStatus: '',
        },
      };

      const { container } = render(
        <DutyStatusReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Veteran Name Display', () => {
    it('should display veteran name in label', () => {
      const data = {
        veteranInformation: {
          firstName: 'Boba',
          lastName: 'Fett',
        },
        dutyStatus: {
          reserveOrGuardStatus: 'yes',
        },
      };

      const { container } = render(
        <DutyStatusReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Boba Fett');
    });

    it('should display "the Veteran" when no name provided', () => {
      const data = {
        dutyStatus: {
          reserveOrGuardStatus: 'yes',
        },
      };

      const { container } = render(
        <DutyStatusReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('the Veteran');
    });
  });
});
