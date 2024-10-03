import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import createCommonStore from 'platform/startup/store';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';

const defaultStore = createCommonStore();

describe('COE applicant service status', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.serviceHistoryChapter.pages.serviceStatus;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect($$('input', container).length).to.equal(5);
  });

  it('Should not submit without required fields', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
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

    fireEvent.submit($('form'));

    expect($$('.usa-input-error', container).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('Should submit with required fields filled', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
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

    fireEvent.submit($('form'));

    expect($$('.usa-input-error', container).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
