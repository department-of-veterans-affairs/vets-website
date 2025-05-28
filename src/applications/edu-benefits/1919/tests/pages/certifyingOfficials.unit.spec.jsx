import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('22-1919 Certifying Officials page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.institutionDetailsChapter.pages.certifyingOfficial;

  it('renders the correct amount of inputs', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(container.querySelectorAll('va-text-input').length).to.equal(2);
  });
});
