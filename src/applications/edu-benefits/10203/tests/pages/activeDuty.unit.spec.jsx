import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../../10203/config/form.js';

describe('Active Duty Military History page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.activeDuty;

  it('renders the active duty page', () => {
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

  it('renders the housing payment infomation when yes is selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_isActiveDuty', 'Y');
    expect(form.find('.feature').length, 1);
    form.unmount();
  });
});
