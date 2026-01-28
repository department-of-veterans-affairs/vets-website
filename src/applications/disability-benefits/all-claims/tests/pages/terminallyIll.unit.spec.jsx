import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../config/form';

describe('Terminally Ill', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.terminallyIll;
  const { defaultDefinitions: definitions } = formConfig;

  it('should render the terminally ill question with Yes/No options', () => {
    const { container, getByText } = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    getByText('High Priority claims');

    const question = container.querySelector('va-radio');
    expect(question).to.have.attribute('label', 'Are you terminally ill?');

    expect(container.querySelector('va-radio-option[label="Yes"]')).to.exist;
    expect(container.querySelector('va-radio-option[label="No"]')).to.exist;
  });

  it('should allow submission without answering the question', () => {
    const onSubmit = sinon.spy();
    const { getByRole, container } = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByRole('button', { name: 'Submit' }));
    expect(onSubmit.calledOnce).to.be.true;
    // Check for absence of an error message.
    expect($('va-radio').error).to.be.null;
  });

  it('should allow submission when answered with "No"', () => {
    const onSubmit = sinon.spy();
    const { getByRole, container } = render(
      <DefinitionTester
        definitions={definitions}
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
    userEvent.click(getByRole('button', { name: 'Submit' }));
    expect(onSubmit.calledOnce).to.be.true;
    // Check for absence of an error message.
    expect($('va-radio').error).to.be.null;
  });

  it('should allow submission when answered with "Yes"', () => {
    const onSubmit = sinon.spy();
    const { getByRole, container } = render(
      <DefinitionTester
        definitions={definitions}
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
    userEvent.click(getByRole('button', { name: 'Submit' }));
    expect(onSubmit.calledOnce).to.be.true;
    // Check for absence of an error message.
    expect($('va-radio').error).to.be.null;
  });
});
