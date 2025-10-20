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

    it('should display instruction text', () => {
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
        'Please review the information entered in this application',
      );
    });

    it('should display note about signature', () => {
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
        'This signature certifies all information provided',
      );
    });
  });

  describe('Statement Content', () => {
    it('should include veteran name in statement', () => {
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

      expect(container.textContent).to.include('Anakin Skywalker');
    });

    it('should include cemetery name in statement', () => {
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

      expect(container.textContent).to.include('Endor Forest Sanctuary');
    });

    it('should include interment allowance rate', () => {
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

      expect(container.textContent).to.include('$978');
    });
  });

  describe('Empty Data Handling', () => {
    it('should handle missing veteran name', () => {
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

      expect(container.textContent).to.include('[Veteran Name]');
    });

    it('should handle missing cemetery name', () => {
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

      expect(container.textContent).to.include('[Cemetery Name]');
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
