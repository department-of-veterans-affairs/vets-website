import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Medical Care History', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.medicalCareHistory;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);
  });

  it('should render medical care options', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          careQuestion: 'yes',
          medicalTreatment: {
            'view:doctorCare': true,
          },
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(4);
  });

  it('should submit', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:combatPtsdType': true,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
