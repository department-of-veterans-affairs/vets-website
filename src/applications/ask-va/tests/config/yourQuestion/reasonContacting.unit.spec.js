import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.yourQuestion.pages.reasonYoureContactingUs;

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

    expect($('h3', container).textContent).to.eq("Reason you're contacting us");
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

    const iHaveAQuestion = getByLabelText('I have a question');
    const iWantToSaySomethingNice = getByLabelText(
      'I want to say something nice',
    );

    expect(iHaveAQuestion.checked).to.be.false;
    expect(iWantToSaySomethingNice.checked).to.be.false;

    fireEvent.click(iHaveAQuestion);

    expect(iHaveAQuestion.checked).to.be.true;
    expect(iWantToSaySomethingNice.checked).to.be.false;

    fireEvent.click(iWantToSaySomethingNice);

    expect(iHaveAQuestion.checked).to.be.false;
    expect(iWantToSaySomethingNice.checked).to.be.true;
  });
});
