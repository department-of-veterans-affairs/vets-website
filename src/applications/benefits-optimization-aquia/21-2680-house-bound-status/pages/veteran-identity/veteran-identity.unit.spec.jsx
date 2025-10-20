/**
 * @module tests/pages/veteran-identity.unit.spec
 * @description Unit tests for VeteranIdentityPage component
 */

import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { VeteranIdentityPage } from './veteran-identity';

describe('VeteranIdentityPage', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
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

      expect(container.textContent).to.include('Enter the Veteran');
      expect(container.textContent).to.include('identification information');
    });

    it('should render veteran claimant radio buttons', () => {
      const { container } = render(
        <VeteranIdentityPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;
      expect(radioGroup.getAttribute('label')).to.equal('Are you the Veteran?');
    });
  });

  describe('Data Display', () => {
    it('should display veteran claimant selection', () => {
      const data = {
        veteranIdentification: {
          isVeteranClaimant: 'yes',
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

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;
      expect(radioGroup.getAttribute('value')).to.equal('yes');
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

      expect(container.querySelector('va-radio')).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        veteranIdentification: {
          veteranFirstName: 'John',
          veteranLastName: 'Doe',
          isVeteranClaimant: 'yes',
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
