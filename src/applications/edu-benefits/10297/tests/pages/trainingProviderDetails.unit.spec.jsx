import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import * as trainingProviderDetails from '../../pages/trainingProviderDetails';

describe('Training Provider Step 3 - Page 2 Details', () => {
  const { schema, uiSchema } = trainingProviderDetails;

  it('should render with all input and select fields', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ trainingProvider: [] }}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(7);
    expect($$('va-select', container).length).to.equal(1);
  });

  it('should render errors on required inputs', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ trainingProvider: [] }}
      />,
    );

    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(4);
      expect($$('va-select[error]', container).length).to.equal(1);
    });
  });
});
