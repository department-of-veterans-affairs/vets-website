import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillDate,
  selectRadio,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('Prisoner of war info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.prisonerOfWar;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);
  });

  it('should render confinement fields', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );

    selectRadio(form, 'root_view:powStatus', 'Y');

    expect(form.find('input').length).to.equal(4);
    expect(form.find('select').length).to.equal(4);
  });

  it('should fail to submit when no data is filled out', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should add another period', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );

    selectRadio(form, 'root_view:powStatus', 'Y');
    fillDate(form, 'root_view:isPOW_confinements_0_from', '2010-05-05');
    fillDate(form, 'root_view:isPOW_confinements_0_to', '2011-05-05');

    form.find('.va-growable-add-btn').simulate('click');

    expect(
      form
        .find('.va-growable-background')
        .first()
        .text(),
    ).to.contain('05/05/2011');
  });

  it('should submit when data filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    selectRadio(form, 'root_view:powStatus', 'Y');
    fillDate(form, 'root_view:isPOW_confinements_0_from', '2010-05-05');
    fillDate(form, 'root_view:isPOW_confinements_0_to', '2011-05-05');

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should show new disabilities', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          newDisabilities: [{ condition: 'ASHD' }, { condition: 'scars' }],
          'view:newDisabilities': true,
        }}
      />,
    );

    selectRadio(form, 'root_view:powStatus', 'Y');
    expect(form.find('input[type="checkbox"]').length).to.equal(2);
    const output = form.render().text();
    expect(output).to.contain('ASHD');
    expect(output).to.contain('Scars');
  });

  it('should not show new disabilities section when none entered', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );

    selectRadio(form, 'root_view:powStatus', 'Y');
    expect(form.find('input[type="checkbox"]').length).to.equal(0);
    const output = form.render().text();
    expect(output).to.not.contain(
      'Which of your new conditions was caused or affected by your POW experience?',
    );
  });
});
