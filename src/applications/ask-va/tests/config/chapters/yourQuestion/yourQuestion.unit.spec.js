import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import configureStore from 'redux-mock-store';
import formConfig from '../../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.yourQuestionPart2.pages.question;

const mockStore = configureStore([]);

describe('yourQuestionPage', () => {
  const store = mockStore({
    navigation: {
      route: {
        path: '/test-path',
      },
    },
  });

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
