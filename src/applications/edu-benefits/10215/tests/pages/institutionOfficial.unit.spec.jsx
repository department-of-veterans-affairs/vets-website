import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('Institution official page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.institutionDetailsChapter.pages.institutionOfficial;

  it('Renders the page with the correct number of inputs', () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(3);
    getByRole('button', { name: /submit/i }).click();
    expect($$('va-text-input[error]', container).length).to.equal(3);
  });
});
