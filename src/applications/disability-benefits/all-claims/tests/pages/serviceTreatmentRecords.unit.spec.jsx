import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('serviceTreatmentRecords', () => {
  const errorClass = '.usa-input-error-message';
  const {
    uiSchema,
    schema,
  } = formConfig.chapters.supportingEvidence.pages.serviceTreatmentRecords;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should submit when "yes" option selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{
          'view:uploadServiceTreatmentRecordsQualifier': {
            'view:hasServiceTreatmentRecordsToUpload': true,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.calledOnce).to.be.true;
    expect(form.find(errorClass).length).to.equal(0);
    form.unmount();
  });

  it('should submit when user selects "no" to upload', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{
          'view:uploadServiceTreatmentRecordsQualifier': {
            'view:hasServiceTreatmentRecordsToUpload': false,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.calledOnce).to.be.true;
    expect(form.find(errorClass).length).to.equal(0);
    const noRadioId = form.find('input[value="N"]').props()['aria-describedby'];
    const alertId = form.find('.service-treatment-records-submit-later').props()
      .id;
    expect(noRadioId).to.not.be.undefined;
    expect(noRadioId).to.eq(alertId);
    form.unmount();
  });
});
