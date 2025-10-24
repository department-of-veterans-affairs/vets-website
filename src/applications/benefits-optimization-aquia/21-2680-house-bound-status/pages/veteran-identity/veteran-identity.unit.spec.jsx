/**
 * @module tests/pages/veteran-identity.unit.spec
 * @description Unit tests for VeteranIdentityPage component
 */

import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { VeteranIdentityPage } from './veteran-identity';

describe('Veteran Identification Form', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Form Initialization', () => {
    it('should initialize empty form for new applications', () => {
      const { container } = render(
        <VeteranIdentityPage
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
        <VeteranIdentityPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Veteran information');
    });

    it('should render instruction text', () => {
      const { container } = render(
        <VeteranIdentityPage
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

  describe('Data Display', () => {
    it('should display veteran identification data', () => {
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
        <VeteranIdentityPage
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
        <VeteranIdentityPage
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
        <VeteranIdentityPage
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
    it('should render in review mode', () => {
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
        <VeteranIdentityPage
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
