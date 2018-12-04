import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  selectRadio,
} from '../../../../../platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('Recent Job Applications', () => {
  const page = formConfig.chapters.disabilities.pages.recentJobApplications;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(6);
    expect(form.find('select').length).to.equal(1);
  });

  it('should add an authority', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_view:hasAppliedEmployers', 'Y');
    fillData(form, 'input#root_appliedEmployers_0_name', 'Company Name');
    fillData(form, 'select#root_appliedEmployers_0_address_country', 'USA');
    fillData(
      form,
      'input#root_appliedEmployers_0_address_addressLine1',
      '123 Street',
    );
    fillData(
      form,
      'input#root_appliedEmployers_0_address_addressLine2',
      'Apt B',
    );
    fillData(form, 'input#root_appliedEmployers_0_address_city', 'Testcity');
    fillData(form, 'select#root_appliedEmployers_0_address_state', 'AL');
    fillData(
      form,
      'input#root_appliedEmployers_0_address_zipCode',
      '12345-1234',
    );
    fillData(form, 'input#root_appliedEmployers_0_workType', 'green collards');
    fillData(form, 'select#root_appliedEmployers_0_dateMonth', '1');
    fillData(form, 'select#root_appliedEmployers_0_dateDay', '1');
    fillData(form, 'input#root_appliedEmployers_0_dateMonth', '2010');

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should allow submission with no authorities', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
