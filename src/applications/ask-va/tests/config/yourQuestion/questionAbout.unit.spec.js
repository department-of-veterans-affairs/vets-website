import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.categoryAndTopic.pages.whoIsYourQuestionAbout;

describe('questionAboutPage', () => {
  // Temporary skip until mural flow is complete and we are in manual qa tickets
  it.skip('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($('h3', container).textContent).to.eq('Who is your question about?');
    expect($$('va-radio-option', container).length).to.equal(3);
  });

  // Temporary skip until form radio schema refactor
  it.skip('should allow selecting who your question is about', () => {
    const { getByLabelText } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    const myselfRadio = getByLabelText('Myself');
    const someoneElseRadio = getByLabelText('Someone else');

    expect(myselfRadio.checked).to.be.false;
    expect(someoneElseRadio.checked).to.be.false;

    fireEvent.click(myselfRadio);

    expect(myselfRadio.checked).to.be.true;
    expect(someoneElseRadio.checked).to.be.false;

    fireEvent.click(someoneElseRadio);

    expect(myselfRadio.checked).to.be.false;
    expect(someoneElseRadio.checked).to.be.true;
  });
});
