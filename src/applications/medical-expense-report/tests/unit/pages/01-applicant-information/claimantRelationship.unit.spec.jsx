import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

describe('Claimant Relationship Page', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
    title,
  } = formConfig.chapters.applicantInformation.pages.claimantRelationship;
  it('renders the claimant relationship options', async () => {
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(title);
    const vaRadio = $(
      'va-radio[label="Which of these best describes you?"]',
      formDOM,
    );
    expect(vaRadio.getAttribute('required')).to.equal('true');

    const vaOptions = $$('va-radio-option', formDOM);
    expect(vaOptions.length).to.equal(2);
    expect(vaOptions[0].getAttribute('label')).to.equal(
      'I’m a Veteran reporting unreimbursed medical expenses',
    );
    expect(vaOptions[1].getAttribute('label')).to.equal(
      'I’m the spouse, dependent, or survivor of a Veteran reporting unreimbursed medical expenses',
    );
  });
});
