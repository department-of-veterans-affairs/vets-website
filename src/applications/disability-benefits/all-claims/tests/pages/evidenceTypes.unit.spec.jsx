import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('evidenceTypes', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.evidenceTypes;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);
  });

  it('should require selecting an evidence option', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.false;
    expect(form.find('.usa-input-error-message').length).to.equal(1);
  });

  it('should submit when no evidence selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': false,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.calledOnce).to.be.true;
    expect(form.find('.usa-input-error-message').length).to.equal(0);
  });

  it('should require at least one evidence type when evidence selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.false;
    expect(form.find('.usa-input-error-message').length).to.equal(1);
  });

  it('should submit with all required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:hasEvidenceFollowUp': {
            'view:selectableEvidenceTypes': {
              'view:hasVAMedicalRecords': true,
            },
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.calledOnce).to.be.true;
    expect(form.find('.usa-input-error-message').length).to.equal(0);
  });
});
