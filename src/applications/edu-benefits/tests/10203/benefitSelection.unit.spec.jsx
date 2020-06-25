import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../10203/config/form';

describe('Edu 10203 benefitSelection', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.benefitSelection.pages.benefitSelection;
  it('renders the correct amount of options for the benefit selection checkboxes', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(6);
    form.unmount();
  });
});
