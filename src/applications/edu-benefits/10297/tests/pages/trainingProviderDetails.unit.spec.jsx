import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as trainingProviderDetails from '../../pages/trainingProviderDetails';

describe('Training Provider Step 3 - Page 2 Details', () => {
  const { schema, uiSchema } = trainingProviderDetails;

  it('should render with all input and select fields', () => {
    const { container } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    expect(container.querySelectorAll('va-text-input')).to.have.lengthOf(7);
    expect(container.querySelectorAll('va-select')).to.have.lengthOf(1);
  });

  it('should render errors on required inputs', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{
          providerName: undefined,
          providerAddress: { country: '' },
        }}
      />,
    );

    await userEvent.click(getByRole('button'));

    expect(container.querySelectorAll('va-text-input[error]')).to.have.lengthOf(
      4,
    );
    expect(container.querySelectorAll('va-select[error]')).to.have.lengthOf(1);
  });
});
