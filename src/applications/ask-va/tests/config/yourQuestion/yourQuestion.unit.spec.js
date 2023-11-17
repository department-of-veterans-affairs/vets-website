import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.yourQuestion.pages.tellUsYourQuestion;

describe('yourQuestionPage', () => {
  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($('h3', container).textContent).to.eq('Tell us your question');
  });

  it('should allow selecting a reason', () => {
    const { getByLabelText } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    const complimentRadio = getByLabelText('Compliment');
    const questionRadio = getByLabelText('Question');

    expect(complimentRadio.checked).to.be.false;
    expect(questionRadio.checked).to.be.false;

    fireEvent.click(complimentRadio);

    expect(complimentRadio.checked).to.be.true;
    expect(questionRadio.checked).to.be.false;

    fireEvent.click(questionRadio);

    expect(complimentRadio.checked).to.be.false;
    expect(questionRadio.checked).to.be.true;
  });
});
