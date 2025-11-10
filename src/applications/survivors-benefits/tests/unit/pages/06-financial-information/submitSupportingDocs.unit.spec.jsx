import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import supportingDocs from '../../../../config/chapters/06-financial-information/incomeAndAssets/submitSupportingDocs';

describe('Supporting docs page', () => {
  const { schema, uiSchema } = supportingDocs;
  it('renders the supporting documents', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    const formDOM = getFormDOM(form);
    const vaLinks = $$('va-link', formDOM);
    expect(vaLinks.length).to.equal(1);
    expect(vaLinks[0].getAttribute('href')).to.equal(
      'https://www.va.gov/find-forms/about-form-21p-0969',
    );
  });
});
