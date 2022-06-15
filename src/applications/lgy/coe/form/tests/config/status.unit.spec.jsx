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

describe('COE applicant service status', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.serviceHistoryChapter.pages.serviceStatus;

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

    expect(formDOM.querySelectorAll('input').length).to.equal(5);
  });

  it('Should not submit without required fields', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('Should submit with required fields filled', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            identity: 'VETERAN',
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
