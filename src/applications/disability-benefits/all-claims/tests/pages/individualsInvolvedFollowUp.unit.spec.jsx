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

describe('781 individuals involved', () => {
  const page =
    formConfig.chapters.disabilities.pages.individualsInvolvedFollowUp0;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:selectablePtsdTypes': {
            'view:combatPtsdType': true,
          },
        }}
        uiSchema={uiSchema}
      />,
    );
    // Expect one question with two radio inputs
    expect($$('va-radio').length).to.equal(1);
    expect($$('va-radio-option').length).to.equal(2);

    const question = container.querySelector('va-radio');
    expect(question).to.have.attribute('label', 'Were they a service member?');

    expect(container.querySelector('va-radio-option[label="Yes"', container)).to
      .exist;
    expect(container.querySelector('va-radio-option[label="No"', container)).to
      .exist;
  });

  it('should submit when no data is filled out', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:combatPtsdType': true,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect($('va-radio').error).to.be.null;
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should add another individual involved', () => {
    const onSubmit = sinon.spy();
    const { getByLabelText, getByText, container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:combatPtsdType': true,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    userEvent.type(getByLabelText(/First name/), 'John');
    userEvent.type(getByLabelText(/Middle name/), 'Phil');
    userEvent.type(getByLabelText(/Last name/), 'Doe');

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'Y' },
    });

    expect(getByText('What was their rank at the time of the event?')).to.exist;
    expect(
      getByText(
        'What unit were they assigned to at the time of the event? (This could include their division, wing, battalion, cavalry, ship, etc.)',
      ),
    ).to.exist;

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'other' },
    });

    const addButton = getByText(/Add another person/i);
    userEvent.click(addButton);

    expect(getByText('John Doe')).to.exist;

    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect($('va-radio').error).to.be.null;
    expect(onSubmit.called).to.be.true;
  });
});
