import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

describe('Supplemental Claims notice-of-acknowledgement page', () => {
  const { schema, uiSchema } = formConfig.chapters.evidence.pages.notice5103;
  const mockStore = configureStore([]);

  // Custom page is rendered, so this only renders a submit button
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

    expect($('button[type="submit"]', container)).to.exist;
  });
});
