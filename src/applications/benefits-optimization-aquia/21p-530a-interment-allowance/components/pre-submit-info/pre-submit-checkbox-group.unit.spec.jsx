/**
 * @module tests/components/pre-submit-info.unit.spec
 * @description Unit tests for PreSubmitCheckboxGroup component
 */

import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import PreSubmitInfo from './pre-submit-checkbox-group';

const createMockStore = (submissionStatus = null) => ({
  getState: () => ({
    form: {
      submission: {
        status: submissionStatus,
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('PreSubmitCheckboxGroup', () => {
  const mockFormData = {
    veteranIdentification: {
      fullName: {
        first: 'Anakin',
        middle: '',
        last: 'Skywalker',
      },
    },
    cemeteryInformation: {
      cemeteryName: 'Endor Forest Sanctuary',
    },
  };

  const mockOnSectionComplete = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const store = createMockStore();
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            formData={mockFormData}
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container).to.exist;
    });

    it('should display legal note', () => {
      const store = createMockStore();
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            formData={mockFormData}
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container.textContent).to.include(
        'According to federal law, there are criminal penalties',
      );
    });

    it('should render statement of truth checkbox', () => {
      const store = createMockStore();
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            formData={mockFormData}
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container.textContent).to.include(
        'I confirm that the identifying information',
      );
    });
  });

  describe('Signature Fields', () => {
    it('should render signature input field', () => {
      const store = createMockStore();
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            formData={mockFormData}
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should render title input field', () => {
      const store = createMockStore();
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            formData={mockFormData}
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      // Check for the organization title text input
      expect(
        container.querySelector(
          'va-text-input[label="Your organization title"]',
        ),
      ).to.exist;
    });

    it('should render statement of truth with checkbox', () => {
      const store = createMockStore();
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            formData={mockFormData}
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container.querySelector('va-statement-of-truth')).to.exist;
    });
  });

  describe('Empty Data Handling', () => {
    it('should render with empty form data', () => {
      const store = createMockStore();
      const emptyFormData = {};

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            formData={emptyFormData}
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container).to.exist;
      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should render legal note with empty data', () => {
      const store = createMockStore();
      const emptyFormData = {};

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            formData={emptyFormData}
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container.textContent).to.include('According to federal law');
    });
  });

  describe('Required Property', () => {
    it('should export required as true', () => {
      expect(PreSubmitInfo.required).to.be.true;
    });

    it('should export CustomComponent', () => {
      expect(PreSubmitInfo.CustomComponent).to.exist;
    });
  });
});
