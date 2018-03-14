import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, selectCheckbox } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/disability-benefits/526EZ/config/form.js';
import initialData from '../schema/initialData.js';

describe('Disability benefits 526EZ evidence type', () => {
  const { schema, uiSchema, arrayPath } = formConfig.chapters.supportingEvidence.pages.evidenceType;
  it('renders evidence type form', () => {
    const form = mount(<DefinitionTester
      arrayPath={arrayPath}
      pagePerItemIndex={0}
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={initialData}
      formData={initialData}
      uiSchema={uiSchema}/>
    );

    expect(form.find('input').length).to.equal(3);
  });

  it('should fill in evidence type information', () => {
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

    // fillData(form, 'select#root_disabilityRating', 10);
    // fillData(form, 'input#root_disabilities', 'Back ache');
    // fillData(form, 'input#root_vaRecordsOffice', 'Local office');
    selectCheckbox(form, 'root_view:vaMedicalRecords');
    selectCheckbox(form, 'root_view:privateMedicalRecords');
    selectCheckbox(form, 'root_view:otherEvidence');
    // fillData(form, 'input[id="root_view:hospital_hospitalName"]', 'Local hospital');
    // fillData(form, 'input[id="root_view:hospital_hospitalAddress_street"]', 'Hospital Street');
    // fillData(form, 'input[id="root_view:hospital_hospitalAddress_city"]', 'Hospital City');
    // fillData(form, 'select[id="root_view:hospital_hospitalAddress_state"]', 'NY');
    // fillData(form, 'input[id="root_view:hospital_hospitalAddress_postalCode"]', '23423');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
