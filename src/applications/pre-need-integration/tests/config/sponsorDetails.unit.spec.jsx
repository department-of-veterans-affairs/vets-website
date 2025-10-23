import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need sponsor Details info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.sponsorInformation.pages.sponsorDetails;

  function getVaInput(container, label) {
    return Array.from(container.querySelectorAll('va-text-input')).find(
      el => el.getAttribute('label') === label,
    );
  }

  it('should render sponsor name input fields', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(getVaInput(container, 'Sponsor’s first name')).to.exist;
    expect(getVaInput(container, 'Sponsor’s last name')).to.exist;
    expect(getVaInput(container, 'Sponsor’s middle name')).to.exist;
    expect(getVaInput(container, 'Sponsor’s maiden name')).to.exist;
  });

  it('should fire events on required fields', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    const firstNameInput = getVaInput(container, 'Sponsor’s first name');
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(
      new CustomEvent('input', { bubbles: true, composed: true }),
    );
    firstNameInput.dispatchEvent(
      new CustomEvent('change', { bubbles: true, composed: true }),
    );
    expect(firstNameInput.value).to.equal('John');
  });
});
