import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  fillData,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../../0994/config/form.js';

import { ERR_MSG_CSS_CLASS } from '../../../0994/constants';

describe('Training program information page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.programSelection.pages.trainingProgramsInformation;

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

    expect(form.find('input').length).to.equal(6);
    expect(form.find('select').length).to.equal(2);

    form.unmount();
  });

  it('successfully submits', () => {
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

    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('renders city and state when in-person selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          vetTecProgram: [{ courseType: 'inPerson' }],
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(6);
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('renders city and state when both selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          vetTecProgram: [{ courseType: 'both' }],
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(6);
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('does not submit if the program name is entered without location or date information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    fillData(form, 'input[name*="root_vetTecPrograms_0_programName"]', 'AWS');

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('does not submit if the program name is entered without city/state or date information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          vetTecProgram: [{ courseType: 'both' }],
        }}
        formData={{}}
      />,
    );

    fillData(form, 'input[name*="root_vetTecPrograms_0_programName"]', 'AWS');

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
