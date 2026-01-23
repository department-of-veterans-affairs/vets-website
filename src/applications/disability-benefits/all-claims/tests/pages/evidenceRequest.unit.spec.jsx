import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../config/form';

describe('evidenceRequest', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.evidenceRequest;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($$('va-radio-option').length).to.equal(2);

    const question = container.querySelector('va-radio');
    expect(question).to.have.attribute(
      'label',
      'Are there medical records from VA or private?',
    );

    expect(container.querySelector('va-radio-option[label="Yes"', container)).to
      .exist;
    expect(container.querySelector('va-radio-option[label="No"', container)).to
      .exist;
  });

  it('should submit when no medical records selected', () => {
    const onSubmit = sinon.spy();
    const { getByText, container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'N' },
    });
    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect($('va-radio').error).to.be.null;
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit when medical records selected', () => {
    const onSubmit = sinon.spy();
    const { getByText, container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'Y' },
    });
    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect($('va-radio').error).to.be.null;
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should require a response before submitting', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect(onSubmit.called).to.be.false;
  });
});
