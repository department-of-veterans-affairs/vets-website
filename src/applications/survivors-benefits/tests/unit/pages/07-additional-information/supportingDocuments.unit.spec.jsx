import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import supportingDocuments from '../../../../config/chapters/07-additional-information/supportingDocuments';

describe('Supporting documents page', () => {
  const { schema, uiSchema } = supportingDocuments;
  it('renders the supporting documents page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(
      form.getByRole('heading', { level: 3, name: 'Supporting documents' }),
    ).to.exist;
    const vaAccordions = $$('va-accordion', formDOM);
    const vaAccordionItems = $$('va-accordion-item', formDOM);

    expect(vaAccordions.length).to.equal(2);
    expect(vaAccordionItems.length).to.equal(6);
  });
});
