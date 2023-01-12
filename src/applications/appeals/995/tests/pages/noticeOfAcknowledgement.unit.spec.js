import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

describe('Supplemental Claims notice-of-acknowledgement page', () => {
  const { schema, uiSchema } = formConfig.chapters.evidence.pages.notice5103;

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

    expect($('input', container)).to.exist;
  });

  it('should prevent continuing with checkbox unchecked', () => {
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
    expect($('.usa-input-error', container)).to.exist;
    expect(onSubmit.called).to.be.false;
  });

  it('should allow submit with checkbox checked', () => {
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
    fireEvent.click($('input[type="checkbox"]', container));
    fireEvent.submit($('form', container));
    expect($('.usa-input-error', container)).to.not.exist;
    expect(onSubmit.called).to.be.true;
  });
});
