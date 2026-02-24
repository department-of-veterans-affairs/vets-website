import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/officialsSummary';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

const baseData = {
  officials: [
    {
      fullName: {
        first: 'John',
        last: 'Doe',
      },
      title: 'Duke',
    },
  ],
};

describe('22-0976 officials summary page', () => {
  it('renders the right label with no items present', () => {
    const { container } = renderPage();

    expect(
      container.querySelector(
        'va-radio[label="Do you have a faculty member, school official, or governing member to add?"]',
      ),
    ).to.exist;
  });

  it('renders the right label with items present', () => {
    const { container } = renderPage(baseData);

    expect(
      container.querySelector(
        'va-radio[label="Do you have an additional faculty member, school official, or governing member to add?"]',
      ),
    ).to.exist;
  });

  it('shows an error when no option is selected on submit', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('error')).to.equal(
      'Select ‘yes’ if you have an official to add',
    );
  });
});
