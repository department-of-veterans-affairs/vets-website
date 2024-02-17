import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import { SHOW_PART3, SHOW_PART3_REDIRECT } from '../../constants';

const {
  schema,
  uiSchema,
  onContinue,
} = formConfig.chapters.conditions.pages.extensionRequest;

describe('extension request page', () => {
  const mockStore = () => ({
    getState: () => ({
      form: {
        data: {
          [SHOW_PART3_REDIRECT]: 'redirected',
        },
      },
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

  it('should render v2 redirect alert', () => {
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

    const alert = $('va-alert', container);
    expect(alert).to.exist;
    expect(alert.innerHTML).to.contain(
      'updated the Board Appeal with new question',
    );
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

  it('should not change redirect form data', () => {
    const setDataSpy = sinon.spy();
    const formData = { [SHOW_PART3]: true, [SHOW_PART3_REDIRECT]: 'done' };
    onContinue(formData, setDataSpy);

    expect(setDataSpy.called).to.be.false;
  });
  it('should set redirect form data to "done"', () => {
    const setDataSpy = sinon.spy();
    const formData = { [SHOW_PART3]: true };
    onContinue(formData, setDataSpy);

    expect(setDataSpy.called).to.be.true;
    expect(setDataSpy.args[0][0]).to.deep.equal({
      ...formData,
      [SHOW_PART3_REDIRECT]: 'done',
    });
  });
});
