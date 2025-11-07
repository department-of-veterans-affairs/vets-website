/**
 * @module tests/pages/duty-status.unit.spec
 * @description Unit tests for DutyStatusPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DutyStatusPage } from './duty-status';

describe('DutyStatusPage', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <DutyStatusPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should render page title', () => {
      const { container } = render(
        <DutyStatusPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'Reserve or National Guard duty status',
      );
    });

    it('should render label with veteran name', () => {
      const data = {
        veteranInformation: {
          firstName: 'Boba',
          lastName: 'Fett',
        },
      };
      const { container } = render(
        <DutyStatusPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup.getAttribute('label')).to.include('Boba Fett');
    });

    it('should render label with "the Veteran" when no name provided', () => {
      const { container } = render(
        <DutyStatusPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup.getAttribute('label')).to.include('the Veteran');
    });

    it('should render radio field', () => {
      const { container } = render(
        <DutyStatusPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;
    });

    it('should render Yes and No options', () => {
      const { container } = render(
        <DutyStatusPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioOptions = container.querySelectorAll('va-radio-option');
      expect(radioOptions.length).to.be.at.least(2);
    });
  });

  describe('Data Display', () => {
    it('should display Yes selection', () => {
      const data = {
        dutyStatus: {
          reserveOrGuardStatus: 'yes',
        },
      };

      const { container } = render(
        <DutyStatusPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup.getAttribute('value')).to.equal('yes');
    });

    it('should display No selection', () => {
      const data = {
        dutyStatus: {
          reserveOrGuardStatus: 'no',
        },
      };

      const { container } = render(
        <DutyStatusPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup.getAttribute('value')).to.equal('no');
    });

    it('should display empty selection', () => {
      const data = {
        dutyStatus: {
          reserveOrGuardStatus: '',
        },
      };

      const { container } = render(
        <DutyStatusPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Data Handling Edge Cases', () => {
    it('should handle null data prop', () => {
      const { container } = render(
        <DutyStatusPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });

    it('should handle undefined data prop', () => {
      const { container } = render(
        <DutyStatusPage
          data={undefined}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });

    it('should handle empty data object', () => {
      const { container } = render(
        <DutyStatusPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        dutyStatus: {
          reserveOrGuardStatus: 'yes',
        },
      };

      const { container } = render(
        <DutyStatusPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });

    it('should show update button in review mode', () => {
      const { container } = render(
        <DutyStatusPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      const updateButton = container.querySelector('va-button[text="Save"]');
      expect(updateButton).to.exist;
    });
  });

  describe('Component Props', () => {
    it('should render without optional props', () => {
      const { container } = render(
        <DutyStatusPage goForward={mockGoForward} />,
      );

      expect(container).to.exist;
    });

    it('should render with all props', () => {
      const data = {
        dutyStatus: {
          reserveOrGuardStatus: 'no',
        },
      };

      const { container } = render(
        <DutyStatusPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });
  });
});
