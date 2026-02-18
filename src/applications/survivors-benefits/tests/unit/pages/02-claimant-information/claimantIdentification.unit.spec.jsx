import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import claimantIdentification from '../../../../config/chapters/02-claimant-information/claimantIdentification';

describe('Claimant Identification Page', () => {
  const { schema, uiSchema } = claimantIdentification;
  it('renders the claimant relationship options', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(
      'Claimant’s identification information',
    );
    const vaTextInput = $$('va-text-input', formDOM);

    const vaSsn = $('va-text-input[label="Social Security number"]', formDOM);
    expect(vaTextInput.length).to.equal(1);

    expect(vaSsn.getAttribute('required')).to.equal('true');
  });
});
