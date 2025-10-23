import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import cloneDeep from 'platform/utilities/data/cloneDeep';

import formConfig from '../../config/form';
import comprehensiveData from '../fixtures/data/pre-api-comprehensive-test.json';
import errorMessages from '../../../shared/content/errorMessages';

const mockStore = data => ({
  getState: () => ({
    form: {
      data: {
        ...data,
        contestedIssues: [],
      },
    },
    formContext: {
      onReviewPage: false,
      reviewMode: false,
      touched: {},
      submitted: false,
    },
  }),
  subscribe: () => {},
  dispatch: () => ({
    setFormData: () => {},
  }),
});

describe('contestable issues page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.issues.pages.contestableIssues;

  it('should render', () => {
    const { container } = render(
      <div>
        <Provider store={mockStore()}>
          <DefinitionTester
            definitions={{}}
            schema={schema}
            uiSchema={uiSchema}
            data={{}}
          />
        </Provider>
      </div>,
    );

    expect($('.add-new-issue', container)).to.exist;
  });

  it('should continue with valid data', () => {
    const { container } = render(
      <div>
        <Provider store={mockStore(comprehensiveData.data)}>
          <DefinitionTester
            definitions={{}}
            schema={schema}
            uiSchema={uiSchema}
            data={comprehensiveData.data}
          />
        </Provider>
      </div>,
    );

    fireEvent.submit($('form', container));
    expect($('.usa-input-error-message', container)).to.not.exist;
  });

  it('should show error with invalid date', () => {
    const data = cloneDeep(comprehensiveData.data);
    data.additionalIssues[0].decisionDate = null;

    const { container } = render(
      <div>
        <Provider store={mockStore(data)}>
          <DefinitionTester
            definitions={{}}
            schema={schema}
            uiSchema={uiSchema}
            data={data}
          />
        </Provider>
      </div>,
    );

    fireEvent.submit($('form', container));

    expect($('.usa-input-error-message', container).textContent).to.contain(
      errorMessages.cardInvalidDate,
    );
  });
});
