import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import veteranIdentification from '../../../../config/chapters/01-veteran-information/veteranIdentification';

describe('Claimant Information Page', () => {
  const { schema, uiSchema } = veteranIdentification;
  it('renders the veteran identification page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(
      'Veteran’s identification information',
    );
    const vaTextInput = $$('va-text-input', formDOM);

    const vaSsn = $('va-text-input[label="Social Security number"]', formDOM);
    const vaFileNumber = $('va-text-input[label="VA file number"]', formDOM);
    const vaServiceNumber = $('va-text-input[label="Service number"]', formDOM);

    expect(vaTextInput.length).to.equal(3);

    expect(vaSsn.getAttribute('required')).to.equal('true');
    expect(vaFileNumber.getAttribute('required')).to.equal('false');
    expect(vaServiceNumber.getAttribute('required')).to.equal('false');
  });
});
