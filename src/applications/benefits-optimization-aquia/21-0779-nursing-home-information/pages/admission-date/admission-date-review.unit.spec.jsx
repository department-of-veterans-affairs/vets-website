import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { AdmissionDateReview } from '@bio-aquia/21-0779-nursing-home-information/pages/admission-date/admission-date-review';

describe('AdmissionDateReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Admission date';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Admission date');
    });

    it('should render edit button', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display admission date', () => {
      const data = {
        admissionDateInfo: {
          admissionDate: '2020-01-15',
        },
      };

      const { container } = render(
        <AdmissionDateReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include(
        'Date of admission to nursing home',
      );
    });

    it('should display formatted date', () => {
      const data = {
        admissionDateInfo: {
          admissionDate: '2020-01-15',
        },
      };

      const { container } = render(
        <AdmissionDateReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should display "Not provided" for missing admission date', () => {
      const data = {
        admissionDateInfo: {},
      };

      const { container } = render(
        <AdmissionDateReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Not provided');
    });

    it('should handle missing admissionDateInfo section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <AdmissionDateReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null admission date', () => {
      const data = {
        admissionDateInfo: {
          admissionDate: null,
        },
      };

      const { container } = render(
        <AdmissionDateReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle undefined admission date', () => {
      const data = {
        admissionDateInfo: {
          admissionDate: undefined,
        },
      };

      const { container } = render(
        <AdmissionDateReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={customEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });

    it('should call editPage when edit button is clicked', () => {
      const editPageSpy = sinon.spy();
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={editPageSpy}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      fireEvent.click(editButton);

      expect(editPageSpy.calledOnce).to.be.true;
    });

    it('should have secondary button style', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton.hasAttribute('secondary')).to.be.true;
    });

    it('should have uswds attribute', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton.hasAttribute('uswds')).to.be.true;
    });

    it('should display Edit text on button', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton.getAttribute('text')).to.equal('Edit');
    });
  });

  describe('CSS Classes', () => {
    it('should have form-review-panel-page class', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewPanel = container.querySelector('.form-review-panel-page');
      expect(reviewPanel).to.exist;
    });

    it('should have review class on dl element', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewDl = container.querySelector('dl.review');
      expect(reviewDl).to.exist;
    });

    it('should have review-row class on data row', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRow = container.querySelector('.review-row');
      expect(reviewRow).to.exist;
    });
  });
});
