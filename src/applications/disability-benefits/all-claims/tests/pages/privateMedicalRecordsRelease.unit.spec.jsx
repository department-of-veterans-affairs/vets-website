import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  fillDate,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';
import initialData from '../initialData.js';

describe('Disability benefits 4142 provider medical records facility information', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.supportingEvidence.pages.privateMedicalRecordsRelease;

  it('should render 4142 form', () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    expect(form);
    expect(form.find('input').length).to.equal(7); // non-checkbox inputs
    expect(form.find('va-checkbox').length).to.equal(1);
    expect(form.find('select').length).to.equal(6);
    form.unmount();
  });

  it('should add a provider facility', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        formData={initialData}
        uiSchema={uiSchema}
      />,
    );

    //  All fields filled
    fillData(
      form,
      'input#root_providerFacility_0_providerFacilityName',
      'Local facility',
    );
    fillDate(
      form,
      'root_providerFacility_0_treatmentDateRange_from',
      '1950-1-3',
    );
    fillDate(form, 'root_providerFacility_0_treatmentDateRange_to', '1951-1-3');
    fillData(
      form,
      'select#root_providerFacility_0_providerFacilityAddress_country',
      'USA',
    );
    fillData(
      form,
      'input#root_providerFacility_0_providerFacilityAddress_street',
      '101 Street',
    );
    fillData(
      form,
      'select#root_providerFacility_0_providerFacilityAddress_state',
      'AK',
    );
    fillData(
      form,
      'input#root_providerFacility_0_providerFacilityAddress_city',
      'Anyville',
    );
    fillData(
      form,
      'input#root_providerFacility_0_providerFacilityAddress_postalCode',
      '29414',
    );

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    expect(form.find('.usa-input-error').length).to.equal(0);
    form.unmount();
  });

  it('does not submit (and renders error messages) when no fields touched', () => {
    const submit = sinon.spy();

    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        formData={initialData}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(submit.called).to.be.false;

    expect(form.find('.usa-input-error').length).to.equal(7);

    expect(form.find('select').length).to.equal(6);
    expect(form.find('input').length).to.equal(7); // non-checkbox inputs
    expect(form.find('va-checkbox').length).to.equal(1);
    form.unmount();
  });

  it('does not submit (and renders error messages) when limited consent option chosen and no fields touched', () => {
    const submit = sinon.spy();

    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:limitedConsent': true,
        }}
        formData={initialData}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(submit.called).to.be.false;

    expect(form.find('.usa-input-error').length).to.equal(8);

    expect(form.find('input').length).to.equal(8); // non-checkbox inputs
    expect(form.find('va-checkbox').length).to.equal(1);
    form.unmount();
  });
});
