import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import React from 'react';
import { Provider } from 'react-redux';
import formConfig from '../../../../config/form';
import { createMockStore } from '../../../common';

const {
  schema,
  uiSchema,
} = formConfig.chapters.yourQuestionPart2.pages.question;

describe('yourQuestionPage', () => {
  const store = createMockStore();

  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
        ,
      </Provider>,
    );

    expect($('h3', container).textContent).to.eq('Your question');
  });
});
