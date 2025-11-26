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
      'You must enter either a Social Security number or a VA File number.',
    );

    const vaTextInput = $$('va-text-input', formDOM);

    const vaSsn = $('va-text-input[label="Social Security number"]', formDOM);
    const vaFileNumber = $('va-text-input[label="VA file number"]', formDOM);
    const serviceNumber = $('va-text-input[label="Service number"]', formDOM);

    expect(vaTextInput.length).to.equal(3);

    expect(vaSsn.getAttribute('required')).to.equal('true');
    expect(vaFileNumber.getAttribute('required')).to.equal('false');
    expect(serviceNumber.getAttribute('required')).to.equal('false');
  });

  it('should require VA file number and not Social Security Number', async () => {
    const dataWithSsn = {
      veteranSocialSecurityNumber: {
        vaFileNumber: '123456789',
      },
    };

    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={dataWithSsn}
      />,
    );
    const formDOM = getFormDOM(form);

    const $vaSsn = formDOM.querySelector(
      'va-text-input[label="Social Security number"]',
    );
    const $vaFileNumber = formDOM.querySelector(
      'va-text-input[label="VA file number"]',
    );

    expect($vaSsn.getAttribute('required')).to.equal('false');
    expect($vaFileNumber.getAttribute('required')).to.equal('true');
  });
});
