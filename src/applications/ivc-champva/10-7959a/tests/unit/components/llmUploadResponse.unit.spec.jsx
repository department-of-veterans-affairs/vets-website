import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { LLM_RESPONSE } from '../../../components/llmUploadResponse';

const mockStore = state => createStore(() => state);

describe('llmUploadWarning', () => {
  const minimalStore = mockStore({});

  const ctxSuccess = {
    formContext: {
      data: {
        'view:champvaClaimsLlmValidation': true,
      },
      fullData: {
        medicalUpload: [
          {
            name: 'file.png',
            llmResponse: { confidence: 0.8, missingFields: [] },
          },
        ],
      },
      schema: {
        properties: {
          medicalUpload: { type: 'array' },
        },
      },
    },
  };

  const ctxFailure = {
    formContext: {
      data: { 'view:champvaClaimsLlmValidation': true },
      fullData: {
        medicalUpload: [{ name: 'file.png' }],
      },
      schema: {
        properties: {
          medicalUpload: { type: 'array' },
        },
      },
    },
  };

  const ctxMissing = {
    formContext: {
      data: { 'view:champvaClaimsLlmValidation': true },
      fullData: {
        medicalUpload: [
          {
            name: 'file.png',
            llmResponse: { confidence: 0.8, missingFields: ['Doctor name'] },
          },
        ],
      },
      schema: {
        properties: {
          medicalUpload: { type: 'array' },
        },
      },
    },
  };

  describe('when champvaClaimsLlmValidation feature flag is true', () => {
    describe('when llm returns success with no missing fields', () => {
      it('should render a va-alert success', () => {
        // Pull the actual function component out since it's contained in form config structure
        const component = LLM_RESPONSE['view:uploadAlert']['ui:description'];

        const { container } = render(
          <Provider store={minimalStore}>{component(ctxSuccess)}</Provider>,
        );

        expect($('va-alert[status="success"]', container)).to.exist;
      });
    });
    describe('when llm returns success with missing fields', () => {
      it('should render a va-alert error', () => {
        const component = LLM_RESPONSE['view:uploadAlert']['ui:description'];

        const { container } = render(
          <Provider store={minimalStore}>{component(ctxMissing)}</Provider>,
        );

        expect($('va-alert[status="error"]', container)).to.exist;
      });
    });
    describe('when llm does not return a result', () => {
      it('should render a va-alert warning', () => {
        const component = LLM_RESPONSE['view:uploadAlert']['ui:description'];

        const { container } = render(
          <Provider store={minimalStore}>{component(ctxFailure)}</Provider>,
        );

        expect($('va-alert[status="warning"]', container)).to.exist;
      });
    });
  });

  describe('when champvaClaimsLlmValidation feature flag is false', () => {
    const ctx = {
      formContext: { data: { 'view:champvaClaimsLlmValidation': false } },
    };

    it('should not render', () => {
      // Pull the actual function component out since it's contained in form config structure
      const component = LLM_RESPONSE['view:uploadAlert']['ui:description'];

      const { container } = render(
        <Provider store={minimalStore}>{component(ctx)}</Provider>,
      );

      expect(container.innerHTML).to.eq('');
    });
  });
});
