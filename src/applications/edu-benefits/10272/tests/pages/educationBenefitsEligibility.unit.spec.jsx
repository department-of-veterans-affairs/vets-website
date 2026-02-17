import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('22-10272 Your education benefits information Step 1 - Page 3', () => {
  const { schema, uiSchema } =
    formConfig.chapters.educationBenefitsChapter.pages
      .educationBenefitsEligibility;

  it('should render with a va-card message explaining eligibility', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-card', container).length).to.equal(1);
  });

  it('should render links to other relevant forms to apply', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-link', container).length).to.equal(3);
  });

  it('should render action link to exit the form', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-link-action', container).length).to.equal(1);
  });
});
