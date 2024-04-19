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

describe('evidenceTypes', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.evidenceTypes;

  it('should render', () => {
    render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($$('va-radio-option').length).to.equal(2);
  });

  it('should submit when no evidence selected', () => {
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

  it('should require at least one evidence type when evidence selected', () => {
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
    // Error text should be present.
    getByText(/please select at least one type of supporting evidence/i);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with all required info', () => {
    const onSubmit = sinon.spy();
    const { getByText, getByLabelText, container } = render(
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
    const checkbox = getByLabelText(/va medical records/i);
    userEvent.click(checkbox);
    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.true;
    // Check for absence of an error message.
    expect($('va-radio').error).to.be.null;
  });
});
