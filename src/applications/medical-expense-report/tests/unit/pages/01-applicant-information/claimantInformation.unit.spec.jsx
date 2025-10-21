import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

describe('Claimant Information Page', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
    title,
  } = formConfig.chapters.applicantInformation.pages.claimantInformation;
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
    const vaTextInput = container.querySelectorAll('va-text-input');
    const vaSelect = container.querySelector('va-select');
    expect(vaTextInput[0].getAttribute('label')).to.equal('First name');
    expect(vaTextInput[0].getAttribute('required')).to.equal('true');
    expect(vaTextInput[1].getAttribute('label')).to.equal('Middle name');
    expect(vaTextInput[1].getAttribute('required')).to.equal('false');
    expect(vaTextInput[2].getAttribute('label')).to.equal('Last name');
    expect(vaTextInput[2].getAttribute('required')).to.equal('true');
    expect(vaSelect.getAttribute('label')).to.equal('Suffix');
    expect(vaSelect.getAttribute('required')).to.equal('false');
  });
});
