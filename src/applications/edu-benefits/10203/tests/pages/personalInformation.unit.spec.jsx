import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../../10203/config/form.js';

describe('Personal Information page', () => {
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

  it('renders no additional questions when no is selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_isEdithNourseRogersScholarship', 'N');
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

  it('renders view:exhaustionOfBenefits when enrolled in STEM', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_isEdithNourseRogersScholarship', 'Y');
    selectRadio(form, 'root_isEnrolledStem', 'Y');
    expect(form.find('input').length).to.equal(6);
    form.unmount();
  });

  it('renders nothing additional when view:exhaustionOfBenefits is yes', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_isEdithNourseRogersScholarship', 'Y');
    selectRadio(form, 'root_isEnrolledStem', 'Y');
    selectRadio(form, 'root_view:exhaustionOfBenefits', 'Y');
    expect(form.find('input').length).to.equal(6);
    form.unmount();
  });

  it('renders nothing additional when view:exhaustionOfBenefits is no', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_isEdithNourseRogersScholarship', 'Y');
    selectRadio(form, 'root_isEnrolledStem', 'Y');
    selectRadio(form, 'root_view:exhaustionOfBenefits', 'N');
    expect(form.find('input').length).to.equal(6);
    form.unmount();
  });

  it('renders teaching certification when isEnrolledStem is no', () => {
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

  it('renders view:exhaustionOfBenefitsAfterPursuingTeachingCert when isPursuingTeachingCert is yes', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_isEdithNourseRogersScholarship', 'Y');
    selectRadio(form, 'root_isEnrolledStem', 'N');
    selectRadio(form, 'root_isPursuingTeachingCert', 'Y');
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });

  it('renders view:exhaustionOfBenefitsAfterPursuingTeachingCert when isPursuingTeachingCert is no', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_isEdithNourseRogersScholarship', 'Y');
    selectRadio(form, 'root_isEnrolledStem', 'N');
    selectRadio(form, 'root_isPursuingTeachingCert', 'N');
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });
});
