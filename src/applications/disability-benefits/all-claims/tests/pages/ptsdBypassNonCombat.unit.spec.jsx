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

describe('PTSD bypass non-combat reasons', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.ptsdBypassNonCombat;
  const { defaultDefinitions: definitions } = formConfig;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );
    // Expect one question with two radio inputs
    expect($$('va-radio').length).to.equal(1);
    expect($$('va-radio-option').length).to.equal(2);

    const question = container.querySelector('va-radio');
    expect(question).to.have.attribute(
      'label',
      'Is your PTSD related to a situation where you feared hostile military or terrorist activity during your military service?',
    );

    expect(container.querySelector('va-radio-option[label="Yes"', container)).to
      .exist;
    expect(container.querySelector('va-radio-option[label="No"', container)).to
      .exist;
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
    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect($('va-radio').error).to.be.null;
    expect(onSubmit.calledOnce).to.be.true;
  });
});
