import React from 'react';
import { expect } from 'chai';
import { render, cleanup, waitFor } from '@testing-library/react';
import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('22-10297 Enter your full name page', () => {
  afterEach(cleanup);

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.identificationChapter.pages.applicantFullName;

  it('renders text inputs for the veterans full name', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    expect(container.querySelectorAll('va-text-input').length).to.equal(3);
  });
  it('should render alert if age is over 62', () => {
    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ dateOfBirth: '1950-01-01' }}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(getByText(/You may not qualify/i)).to.exist;
  });

  it('should render alert if age is under 18', () => {
    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ dateOfBirth: '2020-01-01' }}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(getByText(/You do not qualify/i)).to.exist;
  });

  it('renders error messages for each required field', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    expect($$('va-text-input[error]', container).length).to.equal(0);
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(2);
    });
  });
});
