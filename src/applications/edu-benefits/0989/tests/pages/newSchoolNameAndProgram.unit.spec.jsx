import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/newSchoolNameAndProgram';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0989 new school name and program page', () => {
  it('renders name and program fields', () => {
    const { container } = renderPage();
    expect(container.querySelector('va-text-input[label="School name"]')).to
      .exist;
    expect(container.querySelector('va-text-input[label="Program name"]')).to
      .exist;
  });

  it('shows errors when required fields are empty', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect(
        container.querySelectorAll('va-text-input[error]').length,
      ).to.equal(2);
    });
  });
});
