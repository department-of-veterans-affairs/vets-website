import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
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
    const { container } = form;

    expect(form.getByRole('heading')).to.have.text(title);
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio.getAttribute('label')).to.equal(
      'Which of these best describes you?',
    );

    const options = container.querySelectorAll('va-radio-option');
    expect(options.length).to.equal(2);
    expect(options[0].getAttribute('label')).to.equal(
      'I’m a Veteran, and I want to report unreimbursed medical expenses',
    );
    expect(options[1].getAttribute('label')).to.equal(
      'I’m a spouse, child or dependent of a deceased Veteran, and I want to report unreimbursed medical expenses',
    );
  });
});
