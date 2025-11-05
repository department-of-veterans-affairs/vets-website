/**
 * @module tests/pages/veteran-contact-information-review.unit.spec
 * @description Unit tests for Veteran Contact Information review component
 */

import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { VeteranContactInformationReview } from './veteran-contact-information-review';

describe('VeteranContactInformationReview', () => {
  const mockEditPage = () => {};
  const mockTitle = "Veteran's information";

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const data = {
        veteranContactInformation: {
          ssn: '123-45-6789',
          vaFileNumber: 'c12345678',
        },
      };
      const { container } = render(
        <VeteranContactInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should display title', () => {
      const data = {
        veteranContactInformation: {},
      };
      const { container } = render(
        <VeteranContactInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const heading = container.querySelector('h4');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal(mockTitle);
    });

    it('should display edit button', () => {
      const data = {
        veteranContactInformation: {},
      };
      const { container } = render(
        <VeteranContactInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
      expect(editButton.getAttribute('text')).to.equal('Edit');
    });
  });

  describe('Data Display', () => {
    it('should display SSN', () => {
      const data = {
        veteranContactInformation: {
          ssn: '123-45-6789',
        },
      };
      const { container } = render(
        <VeteranContactInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Social security number');
      expect(text).to.include('123-45-6789');
    });

    it('should display VA file number', () => {
      const data = {
        veteranContactInformation: {
          vaFileNumber: 'c12345678',
        },
      };
      const { container } = render(
        <VeteranContactInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('VA file number');
      expect(text).to.include('c12345678');
    });

    it('should display both SSN and VA file number', () => {
      const data = {
        veteranContactInformation: {
          ssn: '123-45-6789',
          vaFileNumber: 'c12345678',
        },
      };
      const { container } = render(
        <VeteranContactInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('123-45-6789');
      expect(text).to.include('c12345678');
    });
  });

  describe('Missing Data Handling', () => {
    it('should display "Not provided" for missing SSN', () => {
      const data = {
        veteranContactInformation: {
          ssn: '',
        },
      };
      const { container } = render(
        <VeteranContactInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should display "Not provided" for missing VA file number', () => {
      const data = {
        veteranContactInformation: {
          vaFileNumber: '',
        },
      };
      const { container } = render(
        <VeteranContactInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle undefined veteranContactInformation', () => {
      const data = {};
      const { container } = render(
        <VeteranContactInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle null data', () => {
      const data = {
        veteranContactInformation: null,
      };
      const { container } = render(
        <VeteranContactInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle partial data', () => {
      const data = {
        veteranContactInformation: {
          ssn: '123-45-6789',
        },
      };
      const { container } = render(
        <VeteranContactInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('123-45-6789');
      expect(text).to.include('Not provided');
    });
  });
});
