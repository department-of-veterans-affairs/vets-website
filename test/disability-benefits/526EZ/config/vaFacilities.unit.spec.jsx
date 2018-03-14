import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillData } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/disability-benefits/526EZ/config/form.js';
import initialData from '../schema/initialData.js';

describe('Disability benefits 526EZ VA facility', () => {
  const { schema, uiSchema, arrayPath } = formConfig.chapters.supportingEvidence.pages.vaFacilities;
  it('renders VA facility form', () => {
    const form = mount(<DefinitionTester
      arrayPath={arrayPath}
      pagePerItemIndex={0}
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={initialData}
      formData={initialData}
      uiSchema={uiSchema}/>
    );

    expect(form.find('select').length).to.equal(4);
    expect(form.find('input').length).to.equal(3);
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
        uiSchema={uiSchema}/>
    );

    fillData(form, 'select#root_treatments_0_treatment_startTreatmentMonth', '1');
    fillData(form, 'select#root_treatments_0_treatment_startTreatmentDay', '3');
    fillData(form, 'input#root_treatments_0_treatment_startTreatmentYear', '1950');
    fillData(form, 'select#root_treatments_0_treatment_endTreatmentMonth', '1');
    fillData(form, 'select#root_treatments_0_treatment_endTreatmentDay', '3');
    fillData(form, 'input#root_treatments_0_treatment_endTreatmentYear', '1955');
    fillData(form, 'input#root_treatments_0_treatment_treatmentCenterName', 'Local facility');

    form.find('.va-growable-add-btn').simulate('click');

    fillData(form, 'select#root_treatments_1_treatment_startTreatmentMonth', '1');
    fillData(form, 'select#root_treatments_1_treatment_startTreatmentDay', '3');
    fillData(form, 'input#root_treatments_1_treatment_startTreatmentYear', '1951');
    fillData(form, 'select#root_treatments_1_treatment_endTreatmentMonth', '1');
    fillData(form, 'select#root_treatments_1_treatment_endTreatmentDay', '3');
    fillData(form, 'input#root_treatments_1_treatment_endTreatmentYear', '1955');
    fillData(form, 'input#root_treatments_1_treatment_treatmentCenterName', 'Local facility');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
