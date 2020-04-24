import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { ERR_MSG_CSS_CLASS } from '../../constants';

import {
  DefinitionTester,
  fillDate,
  fillData,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('781 Unit Assignment Details', () => {
  const page =
    formConfig.chapters.disabilities.pages.secondaryIncidentUnitAssignment0;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(3);
    expect(form.find('select').length).to.equal(4);
    form.unmount();
  });

  it('should fill in unit assignment details', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    fillData(
      form,
      'input#root_secondaryIncident0_unitAssigned',
      '21st Airborne',
    );
    fillDate(
      form,
      'root_secondaryIncident0_unitAssignedDates_from',
      '2016-07-10',
    );
    fillDate(
      form,
      'root_secondaryIncident0_unitAssignedDates_to',
      '2017-06-12',
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should allow submission if no assigned unit details are submitted', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
