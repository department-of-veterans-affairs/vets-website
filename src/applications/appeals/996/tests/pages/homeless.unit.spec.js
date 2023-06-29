import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

describe('HLR homeless page', () => {
  const { schema, uiSchema } = formConfig.chapters.infoPages.pages.homeless;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($$('input', container).length).to.equal(2);
  });

  it('should allow submit', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click($('input[value="N"]', container));
    fireEvent.submit($('form', container));
    expect($('.usa-input-error-message', container)).to.not.exist;
    expect(onSubmit.called).to.be.true;
  });

  // board option is required
  it('should prevent continuing', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit($('form', container));
    expect($$('.usa-input-error-message', container).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should capture google analytics', () => {
    global.window.dataLayer = [];
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={() => {}}
      />,
    );

    fireEvent.click($('input[value="Y"]', container));

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'int-radio-button-option-click',
      'radio-button-label': 'Are you experiencing homelessness?',
      'radio-button-optionLabel': 'Yes',
      'radio-button-required': false,
    });
  });
});
