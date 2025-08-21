import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  fillDate,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';
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

    expect(form.find('input').length).to.equal(2);
    expect(form.find('select').length).to.equal(0);
    form.unmount();
  });

  it('should add an recent job application', () => {
    const companyName = 'Company Name';
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(
      form,
      'root_unemployability_attemptedToObtainEmploymentSinceUnemployability',
      'Y',
    );

    fillData(
      form,
      'input#root_unemployability_appliedEmployers_0_name',
      companyName,
    );
    fillData(
      form,
      'select#root_unemployability_appliedEmployers_0_address_country',
      'USA',
    );
    fillData(
      form,
      'input#root_unemployability_appliedEmployers_0_address_addressLine1',
      '123 Street',
    );
    fillData(
      form,
      'input#root_unemployability_appliedEmployers_0_address_addressLine2',
      'Apt B',
    );
    fillData(
      form,
      'input#root_unemployability_appliedEmployers_0_address_city',
      'Testcity',
    );
    fillData(
      form,
      'select#root_unemployability_appliedEmployers_0_address_state',
      'AL',
    );
    fillData(
      form,
      'input#root_unemployability_appliedEmployers_0_address_zipCode',
      '12345-1234',
    );
    fillData(
      form,
      'input#root_unemployability_appliedEmployers_0_workType',
      'green collards',
    );
    fillDate(
      form,
      'root_unemployability_appliedEmployers_0_date',
      '2010-01-01',
    );

    form.find('.va-growable-add-btn').simulate('click');

    expect(
      form
        .find('.va-growable-background')
        .first()
        .text(),
    ).to.contain(companyName);

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should allow submission with no recent job applications', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(
      form,
      'root_unemployability_attemptedToObtainEmploymentSinceUnemployability',
      'N',
    );
    expect(form.find('input').length).to.equal(2);
    expect(form.find('select').length).to.equal(0);

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
