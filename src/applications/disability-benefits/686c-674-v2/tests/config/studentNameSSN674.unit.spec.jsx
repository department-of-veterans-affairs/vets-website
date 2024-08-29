import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from 'platform/testing/unit/helpers';
import {
  DefinitionTester,
  fillData,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('Report 674 student personal information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.studentNameAndSsn;
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
    expect(form.find('input').length).to.equal(9);
    expect(form.find('select').length).to.equal(2);
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
    expect(form.find('.usa-input-error').length).to.equal(5);
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
    fillData(form, 'input#root_studentNameAndSsn_fullName_first', 'Bill');
    fillData(form, 'input#root_studentNameAndSsn_fullName_last', 'Bob');
    fillData(form, 'input#root_studentNameAndSsn_ssn', '555-55-5551');
    changeDropdown(form, 'select#root_studentNameAndSsn_birthDateMonth', 1);
    changeDropdown(form, 'select#root_studentNameAndSsn_birthDateDay', 1);
    selectRadio(form, 'root_studentNameAndSsn_isParent', 'N');
    fillData(form, 'input#root_studentNameAndSsn_birthDateYear', '2002');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
