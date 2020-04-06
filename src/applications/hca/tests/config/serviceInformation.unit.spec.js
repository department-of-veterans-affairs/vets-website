import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import moment from 'moment';

import {
  DefinitionTester,
  fillData,
  fillDate,
} from '../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Hca serviceInformation', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.serviceInformation;

  it('renders military info', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).toBe(2);
    expect(form.find('select').length).toBe(6);
    form.unmount();
  });

  it('does not submit without info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(4);

    expect(onSubmit.called).toBe(false);
    form.unmount();
  });

  it('submits with required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    fillData(form, 'select#root_lastServiceBranch', 'army');
    fillDate(form, 'root_lastEntryDate', '1990-1-1');
    fillDate(
      form,
      'root_lastDischargeDate',
      moment()
        .add(130, 'days')
        .format('YYYY-MM-DD'),
    );
    fillData(form, 'select#root_dischargeType', 'general');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(0);
    expect(onSubmit.called).toBe(true);
    form.unmount();
  });

  it('shows discharge type with lastDischargeDate is in the present or past', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    fillData(form, 'select#root_lastServiceBranch', 'army');
    fillDate(form, 'root_lastEntryDate', '1990-1-1');
    fillDate(form, 'root_lastDischargeDate', '2011-1-1');
    expect(form.find('select').length).toBe(6);

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(1);
    expect(onSubmit.called).toBe(false);
    fillData(form, 'select#root_dischargeType', 'honorable');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(0);
    expect(onSubmit.called).toBe(true);
    form.unmount();
  });
});
