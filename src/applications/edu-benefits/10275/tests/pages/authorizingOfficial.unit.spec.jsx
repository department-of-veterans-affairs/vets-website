import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('Authorizing official page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.authorizedOfficialChapter.pages.authorizedOfficial;

  it('Renders the page with the correct number of inputs', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(4);
    expect($$('va-telephone-input', container).length).to.equal(1);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(3);
    });
  });
});
