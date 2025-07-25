import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';
import uploadDocuments from '../../../../config/chapters/12-supporting-documents/uploadDocuments';

describe('document upload', () => {
  const { schema, uiSchema } = uploadDocuments;

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

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          data={{
            files: [
              {
                confirmationCode: 'testing',
              },
              {
                confirmationCode: 'testing2',
              },
            ],
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
