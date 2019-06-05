import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  selectRadio,
} from '../../../../../platform/testing/unit/schemaform-utils';

import formConfig from '../../../1995/config/form.js';

describe('STEM Education benefit selection page', () => {
  const { schema, uiSchema } = formConfig.chapters.benefitSelection.pages.stem;

  it('renders the Edith Nourse Rogers STEM education page', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(2);

    form.unmount();
  });

  it('renders the enrolled in STEM question when yes is selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_isEdithNourseRogersScholarship', 'Y');
    expect(form.find('input').length).to.equal(4);
    form.unmount();
  });

  it('renders the pursuing teacher certification question when No is selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_isEdithNourseRogersScholarship', 'Y');
    selectRadio(form, 'root_isEnrolledStem', 'N');
    expect(form.find('input').length).to.equal(6);

    form.unmount();
  });
});
