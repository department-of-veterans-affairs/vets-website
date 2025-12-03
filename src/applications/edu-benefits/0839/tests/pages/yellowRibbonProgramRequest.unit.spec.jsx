import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as page from '../../pages/yellowRibbonProgramRequest';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      form: (
        state = initialState.form || {
          data: { institutionDetails: { isUsaSchool: true } },
        },
      ) => state,
    },
    preloadedState: initialState,
  });
};

describe('Yellow Ribbon Program Request Page', () => {
  const renderPage = (formData = {}, initialState = {}) => {
    const store = createMockStore(initialState);
    return render(
      <Provider store={store}>
        <DefinitionTester
          schema={page.schema}
          uiSchema={page.uiSchema}
          formData={formData}
          definitions={{}}
        />
      </Provider>,
    );
  };

  describe('Schema', () => {
    it('should export a valid schema object', () => {
      expect(page.schema).to.be.an('object');
      expect(page.schema.type).to.equal('object');
      expect(page.schema.properties).to.be.an('object');
    });

    it('should have empty properties object', () => {
      expect(Object.keys(page.schema.properties)).to.have.length(0);
    });
  });

  describe('UI Schema', () => {
    it('should export a valid uiSchema object', () => {
      expect(page.uiSchema).to.be.an('object');
      expect(page.uiSchema['ui:title']).to.be.a('function');
      expect(page.uiSchema['ui:description']).to.be.a('function');
    });

    it('should render title component for US schools', () => {
      const initialState = {
        form: {
          data: {
            institutionDetails: {
              isUsaSchool: true,
            },
          },
        },
      };

      const { container } = renderPage({}, initialState);
      expect($('.yellow-ribbon-title', container)).to.include.text(
        'Tell us about your Yellow Ribbon Program contributions (U.S. schools)',
      );
    });

    it('should render title component for foreign schools', () => {
      const initialState = {
        form: {
          data: {
            institutionDetails: {
              isUsaSchool: false,
            },
          },
        },
      };

      const { container } = renderPage({}, initialState);
      expect($('.yellow-ribbon-title', container)).to.include.text(
        'Tell us about your Yellow Ribbon Program contributions (foreign schools)',
      );
    });

    it('should render description component for US schools', () => {
      const initialState = {
        form: {
          data: {
            institutionDetails: {
              isUsaSchool: true,
            },
          },
        },
      };

      const { container } = renderPage({}, initialState);
      expect($('.yellow-ribbon-program-description', container)).to.exist;
      expect($('[data-testid="us-school-text"]', container)).to.exist;
      expect($('[data-testid="foreign-school-text"]', container)).to.not.exist;
    });
  });
});
