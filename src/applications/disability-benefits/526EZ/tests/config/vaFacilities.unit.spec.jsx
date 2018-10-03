import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  fillDate,
} from '../../../../../platform/testing/unit/schemaform-utils';
import { mockApiRequest } from '../../../../../platform/testing/unit/helpers';
import formConfig from '../../config/form.js';
import initialData from '../schema/initialData.js';

const originalFetch = global.fetch;

describe('Disability benefits 526EZ VA facility', () => {
  beforeEach(() => {
    mockApiRequest({ data: [] });
  });

  after(() => {
    global.fetch = originalFetch;
  });

  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.supportingEvidence.pages.vaFacilities;
  it('renders VA facility form', () => {
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

    expect(form.find('select').length).to.equal(6); // from/to months, days; country, state
    expect(form.find('input').length).to.equal(4); // facility name, from/to years, city
  });

  it('should add a VA facility', () => {
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

    // Minimum requirements. Country defaults to USA
    fillData(
      form,
      'input#root_treatments_0_treatmentCenterName',
      'Local facility',
    );
    fillDate(form, 'root_treatments_0_treatmentDateRange_from', '1950-1-3');
    fillDate(form, 'root_treatments_0_treatmentDateRange_to', '1951-1-3');

    form.find('.va-growable-add-btn').simulate('click');
    expect(form.find('.usa-input-error').length).to.equal(0);

    // All fields filled
    fillData(
      form,
      'input#root_treatments_1_treatmentCenterName',
      'Local facility',
    );
    fillDate(form, 'root_treatments_1_treatmentDateRange_from', '1951-1-3');
    fillDate(form, 'root_treatments_1_treatmentDateRange_to', '1955-1-3');
    fillData(
      form,
      'select#root_treatments_1_treatmentCenterAddress_country',
      'USA',
    );
    fillData(
      form,
      'select#root_treatments_1_treatmentCenterAddress_state',
      'AK',
    );
    fillData(
      form,
      'input#root_treatments_1_treatmentCenterAddress_city',
      'Anyville',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should validate the treatmentCenterName', () => {
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

    // Fill the form with a name that fails the regex
    fillData(form, 'input#root_treatments_0_treatmentCenterName', '@');
    form.find('form').simulate('submit');
    expect(
      form
        .find('.usa-input-error-message')
        .first()
        .text(),
    ).to.contain('Please enter a valid name.');

    // Fill the form with a name that's too long
    fillData(
      form,
      'input#root_treatments_0_treatmentCenterName',
      'This input is entirely too long-winded to fit into this particular field--Whose idea was it to have this as a facility name anyhow',
    );
    form.find('form').simulate('submit');
    expect(
      form
        .find('.usa-input-error-message')
        .first()
        .text(),
    ).to.contain('100 characters');
  });

  it('validates that state is military type if city is military type', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          disabilities: [
            {
              treatments: [
                {
                  treatmentCenterName: 'Some Facility',
                  treatmentDateRange: {
                    from: '1980-06-04',
                    to: '1981-02-09',
                  },
                  treatmentCenterAddress: {
                    country: 'USA',
                    state: 'TX',
                    city: 'APO',
                  },
                },
              ],
            },
          ],
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
  });

  it('validates that city is military type if state is military type', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          disabilities: [
            {
              treatments: [
                {
                  treatmentCenterName: 'Some Facility',
                  treatmentDateRange: {
                    from: '1980-06-04',
                    to: '1981-02-09',
                  },
                  treatmentCenterAddress: {
                    country: 'USA',
                    state: 'AE',
                    city: 'Detroit',
                  },
                },
              ],
            },
          ],
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
  });

  it('expands state when country is USA', () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          disabilities: [
            {
              treatments: [
                {
                  treatmentCenterName: 'Some Facility',
                  treatmentDateRange: {
                    from: '1980-06-04',
                    to: '1981-02-09',
                  },
                  treatmentCenterAddress: {
                    city: 'Detroit',
                  },
                },
              ],
            },
          ],
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    expect(
      form.find('select#root_treatments_0_treatmentCenterAddress_state').length,
    ).to.equal(0);
    fillData(
      form,
      'select#root_treatments_0_treatmentCenterAddress_country',
      'USA',
    );
    expect(
      form.find('select#root_treatments_0_treatmentCenterAddress_state').length,
    ).to.equal(1);
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
    expect(form.find('.usa-input-error-message').length).to.equal(2); // name, 'from' date

    expect(form.find('select').length).to.equal(6); // from/to months, days; country, state
    expect(form.find('input').length).to.equal(4); // facility name, from/to years, city
  });
});
