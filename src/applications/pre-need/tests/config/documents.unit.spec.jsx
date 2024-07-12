import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { render } from '@testing-library/react';
import formConfig from '../../config/form';

describe('Pre-need attachments', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingDocuments.pages.supportingDocuments;

  it('should render', () => {
    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(1);
  });

  it('should submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    const formDOM = getFormDOM(form);

    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error')).to.be.empty;
    expect(onSubmit.called).to.be.true;
  });

  it('should not submit without attachment id', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          data={{
            application: {
              preneedAttachments: [
                {
                  confirmationCode: 'testing',
                },
              ],
            },
          }}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    const formDOM = getFormDOM(form);

    formDOM.submitForm();
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should not submit without required fields', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          data={{
            application: {
              preneedAttachments: [
                {
                  confirmationCode: 'testing',
                },
              ],
            },
          }}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    const formDOM = getFormDOM(form);

    formDOM.submitForm();
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          data={{
            application: {
              preneedAttachments: [
                {
                  attachmentId: '1',
                  confirmationCode: 'testing',
                  name: 'abc',
                },
                {
                  attachmentId: '1',
                  confirmationCode: 'testing2',
                  name: 'abc',
                },
              ],
            },
          }}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    const formDOM = getFormDOM(form);

    formDOM.submitForm();
    expect(onSubmit.called).to.be.true;
  });
});
