import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$, $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('Primary certifying official page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.primaryOfficialChapter.pages.primaryOfficialDetails;

  it('Renders the page with the correct number of inputs', () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(7);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
    getByRole('button', { name: /submit/i }).click();
    expect($$('va-text-input[error]', container).length).to.equal(4);
  });
  it('Renders the page with the correct number of required inputs after selecting a phone type', () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    getByRole('button', { name: /submit/i }).click();
    expect($$('va-text-input[error]', container).length).to.equal(4);

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'us' },
    });

    expect($$('va-text-input[error]', container).length).to.equal(5);

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'intl' },
    });

    expect($$('va-text-input[error]', container).length).to.equal(5);
  });
});
