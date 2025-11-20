import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { LLM_UPLOAD_WARNING } from '../../../components/llmUploadWarning';

const mockStore = state => createStore(() => state);

describe('llmUploadWarning', () => {
  const minimalStore = mockStore({});

  describe('when champvaClaimsLlmValidation feature flag is true', () => {
    const ctx = {
      formContext: { data: { 'view:champvaClaimsLlmValidation': true } },
    };

    it('should render a va-alert', () => {
      // Pull the actual function component out since it's contained in form config structure
      const component = LLM_UPLOAD_WARNING['view:fileClaim']['ui:description'];

      const { container } = render(
        <Provider store={minimalStore}>{component(ctx)}</Provider>,
      );

      expect($('va-alert', container)).to.exist;
    });
  });

  describe('when champvaClaimsLlmValidation feature flag is false', () => {
    const ctx = {
      formContext: { data: { 'view:champvaClaimsLlmValidation': false } },
    };

    it('should NOT render a va-alert', () => {
      // Pull the actual function component out since it's contained in form config structure
      const component = LLM_UPLOAD_WARNING['view:fileClaim']['ui:description'];

      const { container } = render(
        <Provider store={minimalStore}>{component(ctx)}</Provider>,
      );

      expect($('va-alert', container)).to.not.exist;
    });
  });
});
