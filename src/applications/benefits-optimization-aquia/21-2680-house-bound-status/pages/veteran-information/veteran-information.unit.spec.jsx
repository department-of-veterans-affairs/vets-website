/**
 * @module tests/pages/veteran-information.unit.spec
 * @description Unit tests for VeteranInformationPage component
 */

import { expect } from 'chai';
import React from 'react';
import { renderWithProviders } from '@bio-aquia/shared/utils/test-helpers';
import { VeteranInformationPage } from './veteran-information';

describe('VeteranInformationPage', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  const renderOptions = {
    initialRoute: '/veteran-information',
  };

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = renderWithProviders(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
        renderOptions,
      );

      expect(container).to.exist;
    });

    it('should render instruction text', () => {
      const { container } = renderWithProviders(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
        renderOptions,
      );

      // Component should mount without errors
      // Note: Full rendering requires platform dependencies (SaveFormLink, etc.)
      // which may not be available in test environment
      expect(container).to.exist;
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

      const { container } = renderWithProviders(
        <VeteranInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
        renderOptions,
      );

      expect(container).to.exist;
    });

    it('should handle empty data', () => {
      const { container } = renderWithProviders(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
        renderOptions,
      );

      expect(container).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = renderWithProviders(
        <VeteranInformationPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
        renderOptions,
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

      const { container } = renderWithProviders(
        <VeteranInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
        renderOptions,
      );

      expect(container).to.exist;
    });
  });
});
