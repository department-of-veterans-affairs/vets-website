import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import claimantIdentification from '../../../pages/claimantIdentification';

describe('Claimant Identification Page', () => {
  const { schema, uiSchema } = claimantIdentification;
  it('renders the claimant relationship options', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    const vaTextInput = $$('va-text-input', formDOM);
    const vaSsn = $('va-text-input[label="Social Security number"]', formDOM);
    expect(vaTextInput.length).to.equal(1);
    expect(vaSsn.getAttribute('required')).to.equal('true');
  });
  it('should show the correct title for surviving spouse', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantRelationship: 'SURVIVING_SPOUSE' }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(
      'Your identification information',
    );
  });
  it('should show the correct title for custodian', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantRelationship: 'CUSTODIAN_FILING_FOR_CHILD_UNDER_18' }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(
      'Child’s identification information',
    );
  });
  it('should show the correct title for adult child', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantRelationship: 'CHILD_18-23_IN_SCHOOL' }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(
      'Your identification information',
    );
  });
  it('should show the correct title for helpless adult child', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantRelationship: 'HELPLESS_ADULT_CHILD' }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(
      'Your identification information',
    );
  });
});
