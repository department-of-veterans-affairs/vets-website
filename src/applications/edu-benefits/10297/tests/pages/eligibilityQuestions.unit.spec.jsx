import React from 'react';
import { expect } from 'chai';
import { render, cleanup, waitFor } from '@testing-library/react';
import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('22-10297 Check eligibility page', () => {
  afterEach(cleanup);

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.identificationChapter.pages.eligibilityQuestions;

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

  it('renders error messages for each field if nothing is entered', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    expect($$('va-radio[error]', container).length).to.equal(0);
    expect($$('va-memorable-date[error]', container).length).to.equal(0);
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect($$('va-radio[error]', container).length).to.equal(2);
      expect($$('va-memorable-date[error]', container).length).to.equal(1);
    });
  });
});
