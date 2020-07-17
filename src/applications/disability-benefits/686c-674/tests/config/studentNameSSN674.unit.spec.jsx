import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from '../helpers/index.js';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('Report 674 student personal information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.studentNameAndSSN;
  const formData = {
    'view:selectable686Options': {
      report674: true,
    },
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(form.find('input').length).to.equal(5);
    expect(form.find('select').length).to.equal(3);
    form.unmount();
  });

  it('should not progress without the required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should progress with the required fields filled', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    fillData(form, 'input#root_studentNameAndSSN_fullName_first', 'Bill');
    fillData(form, 'input#root_studentNameAndSSN_fullName_last', 'Bob');
    fillData(form, 'input#root_studentNameAndSSN_ssn', '555-55-5551');
    changeDropdown(form, 'select#root_studentNameAndSSN_birthDateMonth', 1);
    changeDropdown(form, 'select#root_studentNameAndSSN_birthDateDay', 1);
    fillData(form, 'input#root_studentNameAndSSN_birthDateYear', '2002');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
