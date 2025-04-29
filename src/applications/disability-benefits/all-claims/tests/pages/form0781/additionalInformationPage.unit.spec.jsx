import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import userEvent from '@testing-library/user-event';
import Sinon from 'sinon';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { inputVaTextInput } from '@department-of-veterans-affairs/platform-testing/helpers';
import * as additionalInformationPage from '../../../pages/form0781/additionalInformationPage';
import {
  additionalInformationPageTitle,
  additionalInformationPageQuestion,
} from '../../../content/form0781/additionalInformationPage';

describe('Form 0781 additional information page', () => {
  const { schema, uiSchema } = additionalInformationPage;

  it('should define a uiSchema object', () => {
    expect(uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(schema).to.be.an('object');
  });

  it('Displays a text area', () => {
    const onSubmit = Sinon.spy();
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

    getByText(additionalInformationPageTitle);

    const textarea = $('va-textarea', container);
    // Not required
    expect(textarea.getAttribute('required')).to.eq('false');
    expect(textarea.getAttribute('label')).to.eq(
      additionalInformationPageQuestion,
    );
  });

  it('should submit without entering any text', () => {
    const onSubmit = Sinon.spy();

    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );
    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit if text entered', () => {
    const onSubmit = Sinon.spy();

    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    inputVaTextInput(container, 'Here is some additional info', 'va-textarea');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.called).to.be.true;
  });
});
