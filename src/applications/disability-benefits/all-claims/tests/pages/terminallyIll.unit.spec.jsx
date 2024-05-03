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

  it('should render', () => {
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

    expect(container.querySelector('va-radio-option[label="Yes"', container)).to
      .exist;
    expect(container.querySelector('va-radio-option[label="No"', container)).to
      .exist;
  });

  it('should be allowed to submit if no answers are provided', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByText(/submit/i));
    expect(onSubmit.called).to.be.true;
    // Check for absence of an error message.
    expect($('va-radio').error).to.be.null;
  });

  it('should submit if question answered with a no', () => {
    const onSubmit = sinon.spy();
    const { getByText, container } = render(
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
    userEvent.click(getByText(/submit/i));
    expect(onSubmit.calledOnce).to.be.true;
    // Check for absence of an error message.
    expect($('va-radio').error).to.be.null;
  });
});
