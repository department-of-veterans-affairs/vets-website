import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../config/form';

describe('Terminally Ill', () => {
  const { schema, uiSchema } =
    formConfig.chapters.veteranDetails.pages.terminallyIll;
  const { defaultDefinitions: definitions } = formConfig;

  it('should render the terminally ill question with Yes/No options', () => {
    const rendered = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    rendered.getByText('High Priority claims');

    const question = rendered.container.querySelector('va-radio');
    expect(question).to.have.attribute('label', 'Are you terminally ill?');

    expect(rendered.container.querySelector('va-radio-option[label="Yes"]')).to
      .exist;
    expect(rendered.container.querySelector('va-radio-option[label="No"]')).to
      .exist;
  });

  it('should allow submission without answering the question', () => {
    const onSubmit = sinon.spy();
    const rendered = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    rendered.getByRole('button', { name: 'Submit' }).click();
    expect(onSubmit.calledOnce).to.be.true;
    // Check for absence of an error message.
    expect($('va-radio').error).to.be.null;
  });

  it('should allow submission when answered with "No"', () => {
    const onSubmit = sinon.spy();
    const rendered = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    $('va-radio', rendered.container).__events.vaValueChange({
      detail: { value: 'N' },
    });
    userEvent.click(rendered.getByRole('button', { name: 'Submit' }));
    expect(onSubmit.calledOnce).to.be.true;
    // Check for absence of an error message.
    expect($('va-radio').error).to.be.null;
  });

  it('should allow submission when answered with "Yes"', () => {
    const onSubmit = sinon.spy();
    const rendered = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    $('va-radio', rendered.container).__events.vaValueChange({
      detail: { value: 'Y' },
    });
    userEvent.click(rendered.getByRole('button', { name: 'Submit' }));
    expect(onSubmit.calledOnce).to.be.true;
    // Check for absence of an error message.
    expect($('va-radio').error).to.be.null;
  });
});
