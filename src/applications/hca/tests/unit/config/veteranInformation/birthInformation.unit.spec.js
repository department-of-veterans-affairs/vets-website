import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../../config/form';

describe('hca VeteranPlaceOfBirth config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.birthInformation;
  const { defaultDefinitions: definitions } = formConfig;
  const getData = ({ data = {} }) => ({
    mockStore: {
      getState: () => ({
        form: { data },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  it('should render', () => {
    const { mockStore } = getData({});
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );
    expect(container.querySelectorAll('input, select').length).to.equal(2);
  });

  it('should submit empty form', () => {
    const onSubmit = sinon.spy();
    const { mockStore } = getData({});
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );
    const selectors = {
      errors: container.querySelectorAll('.usa-input-error'),
      submitBtn: container.querySelector('button[type="submit"]'),
    };
    fireEvent.click(selectors.submitBtn);

    expect(selectors.errors.length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
