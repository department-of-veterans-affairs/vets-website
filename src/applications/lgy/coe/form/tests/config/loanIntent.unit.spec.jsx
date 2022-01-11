import React from 'react';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils.jsx';
import createCommonStore from 'platform/startup/store';
import formConfig from '../../config/form.js';

const defaultStore = createCommonStore();

describe('COE applicant loan intent', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.loansChapter.pages.loanIntent;

  it('should render', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input').length).to.equal(4);
  });

  it('Should submit', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            intent: 'ONETIMERESTORATION',
          }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
