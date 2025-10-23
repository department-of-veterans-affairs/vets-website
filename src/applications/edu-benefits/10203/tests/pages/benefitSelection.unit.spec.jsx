import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';
import fullSchema from 'vets-json-schema/dist/22-10203-schema.json';
import { benefitsLabels } from '../../content/benefitSelection';

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

describe('Edu 10203 benefitSelection content', () => {
  it('benefitsLabel keys are enum values', () => {
    const { benefit } = fullSchema.properties;

    const displayBenefit = {
      ...benefit,
      enum: [...benefit.enum],
    };

    displayBenefit.enum.splice(1, 0, 'fryScholarship');
    expect(benefitsLabels).to.have.all.keys(displayBenefit.enum);
  });
});
