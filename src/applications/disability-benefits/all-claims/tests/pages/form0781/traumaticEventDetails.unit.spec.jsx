import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { inputVaTextInput } from '@department-of-veterans-affairs/platform-testing/helpers';
import eventDetails from '../../../pages/form0781/traumaticEventDetails';
import {
  eventDetailsPageTitle,
  eventDetailsPrompt,
  eventLocationQuestion,
  eventTimingQuestion,
} from '../../../content/traumaticEventDetails';

describe('Event details', () => {
  const { schema, uiSchema } = {
    schema: eventDetails.schema,
    uiSchema: eventDetails.uiSchema,
  };

  it('should define a uiSchema object', () => {
    expect(eventDetails.uiSchema).to.be.a('object');
  });

  it('should define a schema object', () => {
    expect(eventDetails.schema).to.be.a('object');
  });

  it('displays event details, location, and timing fields', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    expect(getByText(eventDetailsPageTitle)).to.exist;

    const textareas = container.querySelectorAll('va-textarea');
    expect(textareas.length).to.eq(1);

    const detailsTextarea = Array.from(textareas).find(
      textarea => textarea.getAttribute('label') === eventDetailsPrompt,
    );
    expect(detailsTextarea).to.not.be.null;
    expect(detailsTextarea.getAttribute('required')).to.eq('false');

    const textInputs = container.querySelectorAll('va-text-input');
    expect(textInputs.length).to.eq(2);

    const locationTextInput = Array.from(textInputs).find(
      input => input.getAttribute('label') === eventLocationQuestion,
    );
    expect(locationTextInput).to.not.be.null;
    expect(locationTextInput.getAttribute('required')).to.eq('false');

    const timingTextInput = Array.from(textInputs).find(
      input => input.getAttribute('label') === eventTimingQuestion,
    );
    expect(timingTextInput).to.not.be.null;
    expect(timingTextInput.getAttribute('required')).to.eq('false');
  });

  it('should submit without entering any text', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit if text entered', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    inputVaTextInput(container, 'Entered text', 'va-textarea');
    inputVaTextInput(container, 'Entered text', 'va-text-input');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.called).to.be.true;
  });
});
