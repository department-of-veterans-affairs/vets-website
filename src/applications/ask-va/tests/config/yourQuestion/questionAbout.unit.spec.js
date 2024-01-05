import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.yourQuestion.pages.whatsYourQuestionAbout;

describe('questionAboutPage', () => {
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

    expect($('h3', container).textContent).to.eq("What's your question about?");
  });

  it('should allow selecting what your question is about', () => {
    const { getByLabelText } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    const myOwnVABenefitsRadio = getByLabelText('My own VA benefits');
    const someoneElsesVABenefits = getByLabelText("Someone else's VA benefits");

    expect(myOwnVABenefitsRadio.checked).to.be.false;
    expect(someoneElsesVABenefits.checked).to.be.false;

    fireEvent.click(myOwnVABenefitsRadio);

    expect(myOwnVABenefitsRadio.checked).to.be.true;
    expect(someoneElsesVABenefits.checked).to.be.false;

    fireEvent.click(someoneElsesVABenefits);

    expect(myOwnVABenefitsRadio.checked).to.be.false;
    expect(someoneElsesVABenefits.checked).to.be.true;
  });
});
