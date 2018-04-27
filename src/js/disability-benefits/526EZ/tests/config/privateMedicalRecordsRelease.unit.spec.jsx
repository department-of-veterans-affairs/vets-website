import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillData } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';
import initialData from '../schema/initialData.js';

describe('Disability benefits 526EZ VA facility', () => {
  const { schema, uiSchema, arrayPath } = formConfig.chapters.supportingEvidence.pages.privateMedicalRecordRelease;
  it('renders private medical records release form', () => {
    const form = mount(<DefinitionTester
      arrayPath={arrayPath}
      pagePerItemIndex={0}
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={initialData}
      uiSchema={uiSchema}/>
    );

    expect(form.find('select').length).to.equal(6);
    expect(form.find('input').length).to.equal(8);
  });

  it.only('fails to submit without required information', () => {
    const form = mount(<DefinitionTester
      arrayPath={arrayPath}
      pagePerItemIndex={0}
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={{ [arrayPath]: [{}] }}
      uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(4);
  });

  it('should add a private medical records release', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}/>
    );

    fillData(form, '#root_privateRecordReleases_0_treatmentCenterName', 'Local hospital');
    fillData(form, '#root_privateRecordReleases_0_startTreatmentMonth', '1');
    fillData(form, '#root_privateRecordReleases_0_startTreatmentDay', '3');
    fillData(form, '#root_privateRecordReleases_0_startTreatmentYear', '1950');
    fillData(form, '#root_privateRecordReleases_0_endTreatmentMonth', '1');
    fillData(form, '#root_privateRecordReleases_0_endTreatmentDay', '3');
    fillData(form, '#root_privateRecordReleases_0_endTreatmentYear', '1955');
    fillData(form, '#root_privateRecordReleases_0_treatmentCenterName', 'Local facility');

    form.find('.va-growable-add-btn').simulate('click');

    fillData(form, '#root_privateRecordReleases_1_treatmentCenterName', 'Local doctor');
    fillData(form, '#root_privateRecordReleases_1_startTreatmentMonth', '1');
    fillData(form, '#root_privateRecordReleases_1_startTreatmentDay', '3');
    fillData(form, '#root_privateRecordReleases_1_startTreatmentYear', '1951');
    fillData(form, '#root_privateRecordReleases_1_endTreatmentMonth', '1');
    fillData(form, '#root_privateRecordReleases_1_endTreatmentDay', '3');
    fillData(form, '#root_privateRecordReleases_1_endTreatmentYear', '1955');
    fillData(form, '#root_privateRecordReleases_1_treatmentCenterName', 'Local facility');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});

