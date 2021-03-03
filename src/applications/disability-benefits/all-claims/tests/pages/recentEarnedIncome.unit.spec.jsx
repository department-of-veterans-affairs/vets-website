import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('Recent earned income', () => {
  const opts = { showSubforms: true };
  const page = formConfig(opts).chapters.disabilities.pages.recentEarnedIncome;
  const defaultDefinitions = formConfig(opts).defaultDefinitions;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(3);
    form.unmount();
  });

  it('should add an recent earned income and is currently employed', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    fillData(
      form,
      'input#root_unemployability_past12MonthsEarnedIncome',
      '10.00',
    );
    selectRadio(form, 'root_unemployability_view:isEmployed', 'Y');
    fillData(
      form,
      'input#root_unemployability_currentMonthlyEarnedIncome',
      '10.00',
    );

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should add an recent earned income, is not currently employed and did leave job', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    fillData(
      form,
      'input#root_unemployability_past12MonthsEarnedIncome',
      '10.00',
    );
    selectRadio(form, 'root_unemployability_view:isEmployed', 'N');
    selectRadio(form, 'root_unemployability_leftLastJobDueToDisability', 'Y');
    fillData(
      form,
      'textarea#root_unemployability_leftLastJobDueToDisabilityRemarks',
      'remarks',
    );

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should allow submission with no recent earned income', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(3);

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
