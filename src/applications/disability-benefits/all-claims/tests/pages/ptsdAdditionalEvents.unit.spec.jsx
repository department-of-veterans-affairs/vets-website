import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../config/form';

describe('781 additonal events yes/no', () => {
  const page = formConfig.chapters.disabilities.pages.ptsdAdditionalEvents0;
  const { schema, uiSchema, arrayPath } = page;
  const { defaultDefinitions: definitions } = formConfig;
  const data = {
    'view:selectablePtsdTypes': {
      'view:combatPtsdType': true,
    },
  };

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={definitions}
        schema={schema}
        data={data}
        uiSchema={uiSchema}
      />,
    );
    // Expect one question with two radio inputs
    expect($$('va-radio').length).to.equal(1);
    expect($$('va-radio-option').length).to.equal(2);

    const question = container.querySelector('va-radio');
    expect(question).to.have.attribute(
      'label',
      'Do you have another event or situation to tell us about?',
    );

    expect(container.querySelector('va-radio-option[label="Yes"', container)).to
      .exist;
    expect(container.querySelector('va-radio-option[label="No"', container)).to
      .exist;
  });

  it('should submit when no data is filled out', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect($('va-radio').error).to.be.null;
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit when data filled in', () => {
    const onSubmit = sinon.spy();
    const { getByText, container } = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
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
});
