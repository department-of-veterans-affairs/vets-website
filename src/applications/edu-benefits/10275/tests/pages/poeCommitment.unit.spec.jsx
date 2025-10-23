import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { poeCommitment } from '../../pages';

describe('22-10275 - POE Commitment', () => {
  const { schema, uiSchema } = poeCommitment;
  it('renders the page with the correct number of inputs', () => {
    const { container } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );
    expect($$('va-checkbox', container).length).to.equal(8);

    it('renders error messages when required fields are not filled', async () => {
      const { getByRole } = render(
        <DefinitionTester schema={schema} uiSchema={uiSchema} />,
      );
      fireEvent.click(getByRole('button', { name: /Continue/i }));

      await waitFor(() => {
        expect($$('va-checkbox[error]', container).length).to.equal(1);
      });
    });
  });
});
