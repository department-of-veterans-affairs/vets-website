import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('Proprietary Profit Step 2 - Page 2', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.proprietaryProfitChapter.pages.potentialConflictOfInterest;

  it('should render instructions for the step', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('[data-testid="instructions"]', container).length).to.equal(1);
  });

  it('should render with a yesNo radio button', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('should render with an info va-alert', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('[data-testid="info-alert"]', container).length).to.equal(1);
  });

  it('should render an error message if no radio button is selected', () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-radio-option', container).length).to.equal(2);
    getByRole('button', { name: /submit/i }).click();
    expect($$('va-radio[error]', container).length).to.equal(1);
  });
});
