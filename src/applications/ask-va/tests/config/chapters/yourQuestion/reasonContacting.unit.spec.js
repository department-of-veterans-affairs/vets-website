import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

// const {
//   schema,
//   uiSchema,
// } = formConfig.chapters.yourQuestion.pages.reasonYoureContactingUs;

describe('reasonContactingPage', () => {
  // We are currently not using this question for the accessbiility study, skipping
  it.skip('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        // schema={schema}
        // uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($('h2', container).textContent).to.eq('Reason you contacted us');
  });

  it.skip('should allow selecting a reason', () => {
    const { getByLabelText } = render(
      <DefinitionTester
        definitions={{}}
        // schema={schema}
        // uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    const iHadAQuestion = getByLabelText('I had a question');
    const iWantedToSaySomethingNice = getByLabelText(
      'I wanted to say something nice',
    );

    expect(iHadAQuestion.checked).to.be.false;
    expect(iWantedToSaySomethingNice.checked).to.be.false;

    fireEvent.click(iHadAQuestion);

    expect(iHadAQuestion.checked).to.be.true;
    expect(iWantedToSaySomethingNice.checked).to.be.false;

    fireEvent.click(iWantedToSaySomethingNice);

    expect(iHadAQuestion.checked).to.be.false;
    expect(iWantedToSaySomethingNice.checked).to.be.true;
  });
});
