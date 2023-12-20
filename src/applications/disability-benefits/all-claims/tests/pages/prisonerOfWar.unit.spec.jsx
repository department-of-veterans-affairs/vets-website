import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillDate,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('Prisoner of war info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.prisonerOfWar;

  const formData = {
    serviceInformation: {
      servicePeriods: [{ dateRange: { from: '2009-01-01', to: '2013-01-01' } }],
    },
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should render confinement fields', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );

    selectRadio(form, 'root_view:powStatus', 'Y');

    expect(form.find('input').length).to.equal(4);
    expect(form.find('select').length).to.equal(4);
    form.unmount();
  });

  it('should fail to submit when no data is filled out', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should add another period', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );

    selectRadio(form, 'root_view:powStatus', 'Y');
    fillDate(form, 'root_view:isPow_confinements_0_from', '2010-05-05');
    fillDate(form, 'root_view:isPow_confinements_0_to', '2011-05-05');

    form.find('.va-growable-add-btn').simulate('click');

    expect(
      form
        .find('.va-growable-background')
        .first()
        .text(),
    ).to.contain('May 5, 2010');
    form.unmount();
  });

  it('should submit when data filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    selectRadio(form, 'root_view:powStatus', 'Y');
    fillDate(form, 'root_view:isPow_confinements_0_from', '2010-05-05');
    fillDate(form, 'root_view:isPow_confinements_0_to', '2011-05-05');

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should show new disabilities', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...formData,
          newDisabilities: [{ condition: 'ASHD' }, { condition: 'scars' }],
        }}
      />,
    );

    selectRadio(form, 'root_view:powStatus', 'Y');
    expect(form.find('input[type="checkbox"]').length).to.equal(2);
    const output = form.render().text();
    expect(output).to.contain('ASHD');
    expect(output).to.contain('Scars');
    form.unmount();
  });

  it('should not show new disabilities section when none entered', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );

    selectRadio(form, 'root_view:powStatus', 'Y');
    expect(form.find('input[type="checkbox"]').length).to.equal(0);
    const output = form.render().text();
    expect(output).to.not.contain(
      'Which of your conditions is connected to your POW experience? ',
    );
    form.unmount();
  });

  it('should require confinement dates to be within a single service period', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    selectRadio(form, 'root_view:powStatus', 'Y');
    fillDate(form, 'root_view:isPow_confinements_0_from', '2010-05-05');
    fillDate(form, 'root_view:isPow_confinements_0_to', '2014-05-05'); // After service period

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
