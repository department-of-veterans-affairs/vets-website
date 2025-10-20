import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

describe('Remove Dependent Picklist options page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.optionSelection.pages.removeDependentsPicklistOptions;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    // Using a custom page, which isn't rendered by DefinitionTester
    expect($('form', container)).to.exist;
  });
});

describe('Remove Dependent Picklist followup page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.removeDependentsPicklistFollowupPages.pages.removeDependentFollowup;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    // Using a custom page, which isn't rendered by DefinitionTester
    expect($('form', container)).to.exist;
  });
});
