import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('22-10297 Check eligibility page', () => {
  afterEach(cleanup);

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.checkEligibilityChapter.pages.eligibilityQuestions;

  it('renders the duty eligibility radio question', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    const dutyRequirementRadio = container.querySelector(
      'va-radio[label="Which of these statements applies to you?"]',
    );

    expect(dutyRequirementRadio).to.exist;
    expect(
      dutyRequirementRadio.querySelectorAll('va-radio-option').length,
    ).to.equal(3);
  });

  it('renders date of birth question', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    expect(container.querySelector('va-memorable-date')).to.exist;
  });

  it('renders the discharge eligibility yesNo question', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    const dischargeYesNo = container.querySelector(
      'va-radio[label="Did you receive a discharge under conditions other than dishonorable?"]',
    );

    expect(dischargeYesNo).to.exist;
    expect(dischargeYesNo.querySelectorAll('va-radio-option').length).to.equal(
      2,
    );
  });
});
