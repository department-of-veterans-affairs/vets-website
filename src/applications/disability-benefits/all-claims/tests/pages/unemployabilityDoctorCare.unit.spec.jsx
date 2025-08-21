import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';
import initialData from '../initialData.js';

import { ERR_MSG_CSS_CLASS } from '../../constants';

describe("Doctor's care unemployability", () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.unemployabilityDoctorCare;

  it("renders the add doctor's care", () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(6);
    expect(form.find('textarea').length).to.equal(1);

    form.unmount();
  });

  it('successfully submits when at least one doctor is entered', () => {
    const doctorName = 'dr. acula';
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    fillData(
      form,
      'input#root_unemployability_doctorProvidedCare_0_name',
      doctorName,
    );
    fillData(
      form,
      'select#root_unemployability_doctorProvidedCare_0_address_country',
      'USA',
    );
    fillData(
      form,
      'input#root_unemployability_doctorProvidedCare_0_address_addressLine1',
      '123 Street',
    );
    fillData(
      form,
      'input#root_unemployability_doctorProvidedCare_0_address_addressLine2',
      'Apt B',
    );
    fillData(
      form,
      'input#root_unemployability_doctorProvidedCare_0_address_city',
      'Testcity',
    );
    fillData(
      form,
      'select#root_unemployability_doctorProvidedCare_0_address_state',
      'AL',
    );
    fillData(
      form,
      'input#root_unemployability_doctorProvidedCare_0_address_zipCode',
      '12345-1234',
    );
    fillData(
      form,
      'textarea#root_unemployability_doctorProvidedCare_0_dates',
      '01/01/2010 to 02/01/2010',
    );
    form.find('.va-growable-add-btn').simulate('click');
    expect(
      form
        .find('.va-growable-background')
        .first()
        .text(),
    ).to.contain(doctorName);

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should allow submission with no doctors', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(6);
    expect(form.find('textarea').length).to.equal(1);

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
