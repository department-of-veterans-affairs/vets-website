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

  it('should not expand the upload button by default', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
      />,
    );

    expect(
      form.find('#root_serviceTreatmentRecordsAttachments_add_label').length,
    ).to.equal(0);
    form.unmount();
  });

  it('should expand upload when "yes" option selected', () => {
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
      />,
    );

    expect(
      form.find('#root_serviceTreatmentRecordsAttachments_add_label').length,
    ).to.equal(1);
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
    form.unmount();
  });

  it('should not submit without an upload if one indicated', () => {
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
    expect(onSubmit.called).to.be.false;
    expect(form.find(errorClass).length).to.equal(1); // upload at least 1 document
    form.unmount();
  });

  it('should not submit without additional upload info', () => {
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
          serviceTreatmentRecordsAttachments: [{ confirmationCode: '1234' }],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.false;
    expect(form.find(errorClass).length).to.equal(1); // name and attachment ID required
    form.unmount();
  });

  it('should submit with all required info', () => {
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
          serviceTreatmentRecordsAttachments: [
            {
              name: 'Test.pdf',
              attachmentId: 'L450',
              confirmationCode: '1234',
            },
          ],
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
});
