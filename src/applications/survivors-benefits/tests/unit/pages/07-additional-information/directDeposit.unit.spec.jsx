import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import directDeposit from '../../../../config/chapters/07-additional-information/directDeposit';

describe('Direct deposit page', () => {
  const { schema, uiSchema } = directDeposit;
  it('renders the direct deposit page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(
      form.getByRole('heading', {
        level: 3,
        name: 'Direct deposit for survivor benefits',
      }),
    ).to.exist;
    const vaAdditionalInfos = $$('va-additional-info', formDOM);

    expect(vaAdditionalInfos.length).to.equal(1);
  });
});
