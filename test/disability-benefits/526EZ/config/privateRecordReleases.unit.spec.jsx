import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillData } from '../../../../src/platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../../src/js/disability-benefits/526EZ/config/form.js';
import initialData from '../schema/initialData.js';

describe('Disability benefits 526EZ VA facility', () => {
  const { schema, uiSchema, arrayPath } = formConfig.chapters.supportingEvidence.pages.privateMedicalRecordRelease;
  it('renders private record release form', () => {
    const form = mount(<DefinitionTester
      arrayPath={arrayPath}
      pagePerItemIndex={0}
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={initialData}
      formData={initialData}
      uiSchema={uiSchema}/>
    );

    /**
     * Selects: start / end months, start / end days, country, state
     * Inputs: treatmentCenterName, consent, start / end years, street 1, street 2, city, zip
     */
    expect(form.find('select').length).to.equal(6);
    expect(form.find('input').length).to.equal(8);
  });

  it('should add a private release', () => {
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
        uiSchema={uiSchema}/>
    );

    fillData(form, 'select#root_privateRecordReleases_0_treatmentDateRange_fromMonth', '1');
    fillData(form, 'select#root_privateRecordReleases_0_treatmentDateRange_fromDay', '3');
    fillData(form, 'input#root_privateRecordReleases_0_treatmentDateRange_fromYear', '1950');
    fillData(form, 'select#root_privateRecordReleases_0_treatmentDateRange_toMonth', '1');
    fillData(form, 'select#root_privateRecordReleases_0_treatmentDateRange_toDay', '3');
    fillData(form, 'input#root_privateRecordReleases_0_treatmentDateRange_toYear', '1955');
    fillData(form, 'input#root_privateRecordReleases_0_treatmentCenterName', 'Local facility');
    fillData(form, 'select#root_privateRecordReleases_0_treatmentCenterAddress_country', 'USA');
    fillData(form, 'input#root_privateRecordReleases_0_treatmentCenterAddress_addressLine1', '123 Some Street');

    form.find('.va-growable-add-btn').simulate('click');

    fillData(form, 'select#root_privateRecordReleases_1_treatmentDateRange_fromMonth', '1');
    fillData(form, 'select#root_privateRecordReleases_1_treatmentDateRange_fromDay', '3');
    fillData(form, 'input#root_privateRecordReleases_1_treatmentDateRange_fromYear', '1951');
    fillData(form, 'select#root_privateRecordReleases_1_treatmentDateRange_toMonth', '1');
    fillData(form, 'select#root_privateRecordReleases_1_treatmentDateRange_toDay', '3');
    fillData(form, 'input#root_privateRecordReleases_1_treatmentDateRange_toYear', '1955');
    fillData(form, 'input#root_privateRecordReleases_1_treatmentCenterName', 'Local facility');
    fillData(form, 'select#root_privateRecordReleases_1_treatmentCenterAddress_country', 'USA');
    fillData(form, 'input#root_privateRecordReleases_1_treatmentCenterAddress_addressLine1', '123 Some Street');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
