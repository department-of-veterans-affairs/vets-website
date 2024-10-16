import React from 'react';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import createCommonStore from 'platform/startup/store';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';

const defaultStore = createCommonStore();

describe('COE additional information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.contactInformationChapter.pages.additionalInformation;

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

    expect($$('input', formDOM).length).to.equal(2);
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

    expect($$('.usa-input-error', formDOM).length).to.equal(2);
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
            contactPhone: '8005551212',
            contactEmail: 'me@me.com',
          }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    formDOM.submitForm();

    expect($$('.usa-input-error', formDOM).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
