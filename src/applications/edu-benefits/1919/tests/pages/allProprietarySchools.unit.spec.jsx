import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('22-1919 All Proprietary Schools page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.allProprietarySchoolsChapter.pages.allProprietarySchoolsIntro;

  it('renders the correct amount of inputs', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(container.querySelectorAll('va-radio').length).to.equal(1);
  });
  it('should show errors when required field is empty', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    const form = container.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true }));
    expect(container.querySelectorAll('va-radio[error]').length).to.equal(1);
  });
});
