import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { ERR_MSG_CSS_CLASS } from '../../../0994/constants';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../0994/config/form';

describe('VET TEC military service', () => {
  const page = formConfig.chapters.militaryService.pages.militaryService;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const form = mount(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );
    expect(form.find('input').length).to.equal(4);
    form.unmount();
  });

  it('should require active duty', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
    expect(form.find('.form-expanding-group-open').length).to.equal(0);
    form.unmount();
  });

  it('should submit when active duty selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find(`input[name="root_activeDuty"][value="Y"]`).simulate('change', {
      target: { Y: 'Y' },
    });
    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
