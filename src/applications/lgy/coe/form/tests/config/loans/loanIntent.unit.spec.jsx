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

describe('COE applicant loan intent', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.loansChapter.pages.loanIntent;

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

    expect($$('input', container).length).to.equal(4);
  });

  it('Should submit', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
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

    fireEvent.submit($('form'));

    expect($$('.usa-input-error', container).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
