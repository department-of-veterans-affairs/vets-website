import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

const { schema, uiSchema } = formConfig.chapters.issues.pages.extensionRequest;

describe('extension request page', () => {
  const mockStore = () => ({
    getState: () => ({
      form: { data: {} },
    }),
    subscribe: () => {},
    dispatch: () => {},
  });

  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

    expect($('va-radio', container)).to.exist;
  });

  it('should allow submit with radios unselected (optional)', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    fireEvent.submit($('form', container));
    expect($('.usa-input-error', container)).to.not.exist;
    expect(onSubmit.called).to.be.true;
  });

  it('should allow submit with one radio selected', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{ requestingExtension: true }}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    fireEvent.submit($('form', container));
    expect(container.innerHTML).to.contain('value="Y" checked');
    expect($('.usa-input-error', container)).to.not.exist;
    expect(onSubmit.called).to.be.true;
  });
});
