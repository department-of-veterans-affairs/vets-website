/**
 * @module tests/pages/veteran-information.unit.spec
 * @description Unit tests for VeteranInformationPage component
 */

import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { VeteranInformationPage } from './veteran-information';

describe('VeteranInformationPage', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should render instruction text', () => {
      const { container } = render(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'Confirm the personal information',
      );
      expect(container.textContent).to.include('on file for the Veteran');
    });
  });

  describe('Data Handling', () => {
    it('should render with existing veteran information data', () => {
      const data = {
        veteranIdentification: {
          veteranFullName: {
            first: 'Boba',
            middle: '',
            last: 'Fett',
          },
          veteranSSN: '123456789',
          veteranDOB: '1980-05-04',
        },
      };

      const { container } = render(
        <VeteranInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty data', () => {
      const { container } = render(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <VeteranInformationPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render veteran information in review mode', () => {
      const data = {
        veteranIdentification: {
          veteranFullName: {
            first: 'Boba',
            middle: '',
            last: 'Fett',
          },
          veteranSSN: '123456789',
          veteranDOB: '1980-05-04',
        },
      };

      const { container } = render(
        <VeteranInformationPage
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
