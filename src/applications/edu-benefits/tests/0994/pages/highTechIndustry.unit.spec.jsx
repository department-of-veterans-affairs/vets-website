import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  getFormDOM,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../../0994/config/form.js';
import ReactTestUtils from 'react-dom/test-utils';

describe('High tech industry page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.highTechWorkExp.pages.highTechIndustry;

  it('renders the work experience page', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);

    form.unmount();
  });

  it('fails to submit when no answer selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('renders radio and checkbox group when yes selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: true,
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(13);
    form.unmount();
  });

  it('renders second question when no selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: false,
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(4);
    form.unmount();
  });

  it('fails to submit when no answer selected with the second question', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: false,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('renders radio and checkbox group when yes selected on second question', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: false,
          pastHighTechnologyEmployment: true,
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(15);
    form.unmount();
  });

  it('successfully submits when required questions answered', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: false,
          pastHighTechnologyEmployment: false,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  const HIGH_TECH_EMPLOYMENT_TYPES = {
    COMPUTER_PROGRAMMING:
      'input[name*="root_view:salaryEmploymentTypes_highTechnologyEmploymentType_computerProgramming"]',
    COMPUTER_SOFTWARE:
      'input[name*="root_view:salaryEmploymentTypes_highTechnologyEmploymentType_computerSoftware"]',
    DATA_PROCESSING:
      'input[name*="root_view:salaryEmploymentTypes_highTechnologyEmploymentType_dataProcessing"]',
    INFORMATION_SCIENCES:
      'input[name*="root_view:salaryEmploymentTypes_highTechnologyEmploymentType_informationSciences"]',
    MEDIA_APPLICATION:
      'input[name*="root_view:salaryEmploymentTypes_highTechnologyEmploymentType_mediaApplication"]',
    NONE_APPLY:
      'input[name*="root_view:salaryEmploymentTypes_highTechnologyEmploymentType_noneApply"]',
  };

  const getCheckboxes = formDOM => {
    const checkboxes = {
      computerProgramming: formDOM.getElement(
        HIGH_TECH_EMPLOYMENT_TYPES.COMPUTER_PROGRAMMING,
      ),
      computerSoftware: formDOM.getElement(
        HIGH_TECH_EMPLOYMENT_TYPES.COMPUTER_SOFTWARE,
      ),
      dataProcessing: formDOM.getElement(
        HIGH_TECH_EMPLOYMENT_TYPES.DATA_PROCESSING,
      ),
      informationSciences: formDOM.getElement(
        HIGH_TECH_EMPLOYMENT_TYPES.INFORMATION_SCIENCES,
      ),
      mediaApplication: formDOM.getElement(
        HIGH_TECH_EMPLOYMENT_TYPES.MEDIA_APPLICATION,
      ),
      noneApply: formDOM.getElement(HIGH_TECH_EMPLOYMENT_TYPES.NONE_APPLY),
    };
    return checkboxes;
  };

  it('all checkboxes checked then noneApply checked causes all other checkboxes to be cleared', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: false,
          pastHighTechnologyEmployment: true,
          'view:salaryEmploymentTypes': {
            highTechnologyEmploymentType: {
              computerProgramming: true,
              computerSoftware: true,
              dataProcessing: true,
              informationSciences: true,
              mediaApplication: true,
              noneApply: true,
            },
          },
        }}
        formData={{}}
      />,
    );

    const formDOM = getFormDOM(form);

    const checkboxes = getCheckboxes(formDOM);

    expect(checkboxes.computerProgramming.checked).to.equal(false);
    expect(checkboxes.computerSoftware.checked).to.equal(false);
    expect(checkboxes.dataProcessing.checked).to.equal(false);
    expect(checkboxes.informationSciences.checked).to.equal(false);
    expect(checkboxes.mediaApplication.checked).to.equal(false);
    expect(checkboxes.noneApply.checked).to.equal(true);
  });

  it('noneApply checkbox is checked then any other checked causes noneApply to be cleared', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: false,
          pastHighTechnologyEmployment: true,
          'view:salaryEmploymentTypes': {
            highTechnologyEmploymentType: {
              computerProgramming: true,
              computerSoftware: false,
              dataProcessing: false,
              informationSciences: false,
              mediaApplication: false,
              noneApply: true,
            },
          },
        }}
        formData={{}}
      />,
    );

    const formDOM = getFormDOM(form);

    const checkboxes = getCheckboxes(formDOM);

    expect(checkboxes.computerProgramming.checked).to.equal(true);
    expect(checkboxes.computerSoftware.checked).to.equal(false);
    expect(checkboxes.dataProcessing.checked).to.equal(false);
    expect(checkboxes.informationSciences.checked).to.equal(false);
    expect(checkboxes.mediaApplication.checked).to.equal(false);
    expect(checkboxes.noneApply.checked).to.equal(false);
  });

  it('any checkbox is checked then noneApply is checked causes other checkbox to be cleared', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: false,
          pastHighTechnologyEmployment: true,
          'view:salaryEmploymentTypes': {
            highTechnologyEmploymentType: {
              computerProgramming: true,
              noneApply: true,
            },
          },
        }}
        formData={{}}
      />,
    );

    const formDOM = getFormDOM(form);

    const checkboxes = getCheckboxes(formDOM);

    expect(checkboxes.computerProgramming.checked).to.equal(false);
    expect(checkboxes.computerSoftware.checked).to.equal(false);
    expect(checkboxes.dataProcessing.checked).to.equal(false);
    expect(checkboxes.informationSciences.checked).to.equal(false);
    expect(checkboxes.mediaApplication.checked).to.equal(false);
    expect(checkboxes.noneApply.checked).to.equal(true);
  });
});
