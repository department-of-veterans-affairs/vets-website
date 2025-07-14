import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import * as readOnlyCertifyingOfficial from '../../pages/readOnlyCertifyingOfficial';

const { schema, uiSchema } = readOnlyCertifyingOfficial;

describe('8794 – Read-only certifying official • item page', () => {
  it('renders three text inputs for first / middle / last names', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(3);
  });

  it('shows validation errors for required first & last when empty', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    // no errors before submit
    expect($$('va-text-input[error]', container).length).to.equal(0);

    // click Continue / Submit
    getByRole('button', { name: /submit|continue/i }).click();

    // first & last required → 2 errors; middle optional
    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(2);
    });
  });
});
