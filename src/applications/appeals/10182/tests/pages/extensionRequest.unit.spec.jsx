import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import { content } from '../../content/extensionRequest';
import { SHOW_PART3_REDIRECT } from '../../constants';

const {
  schema,
  uiSchema,
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

    expect($$('input', container).length).to.eq(2);
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

  it('should capture google analytics', () => {
    global.window.dataLayer = [];
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
          onSubmit={() => {}}
        />
      </Provider>,
    );

    fireEvent.click($('input[value="Y"]', container));

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'int-radio-button-option-click',
      'radio-button-label': content.label,
      'radio-button-optionLabel': 'Yes',
      'radio-button-required': false,
    });
  });
});
