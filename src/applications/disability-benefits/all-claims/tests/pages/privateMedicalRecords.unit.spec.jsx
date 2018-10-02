import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('526 All Claims Private medical records', () => {
  const errorClass = '.usa-input-error-message';
  const page = formConfig.chapters.supportingEvidence.pages.privateMedicalRecords;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const form = mount(<DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      uiSchema={uiSchema}
      data={{}}
      formData={{}}/>
    );

    expect(form.find('input').length).to.equal(2);
  });

  it('should not expand the upload button by default', () => {
    const form = mount(<DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      uiSchema={uiSchema}
      data={{}}
      formData={{}}/>
    );

    expect(form.find('#root_privateMedicalRecords_add_label').length).to.equal(0);
  });

  it('should expand upload when "yes" option selected', () => {
    const form = mount(<DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      uiSchema={uiSchema}
      data={{
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true
        }
      }}
      formData={{}}/>
    );

    expect(form.find('#root_privateMedicalRecords_add_label').length).to.equal(1);
  });

  // TODO: This will change once 4142 is integrated
  it('should submit when user selects "no" to upload', () => {
    const onSubmit = sinon.spy();
    const form = mount(<DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      uiSchema={uiSchema}
      data={{
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': false
        }
      }}
      formData={{}}
      onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(onSubmit.calledOnce).to.be.true;
    expect(form.find(errorClass).length).to.equal(0);
  });

  it('should not submit without an upload if one indicated', () => {
    const onSubmit = sinon.spy();
    const form = mount(<DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      uiSchema={uiSchema}
      data={{
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true
        }
      }}
      formData={{}}
      onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.false;
    expect(form.find(errorClass).length).to.equal(1); // upload at least 1 doc
  });

  it('should not submit without additional upload info', () => {
    const onSubmit = sinon.spy();
    const form = mount(<DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      uiSchema={uiSchema}
      data={{
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true
        },
        privateMedicalRecords: [{ confirmationCode: '123345asdf' }]
      }}
      formData={{}}
      onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.false;
    expect(form.find(errorClass).length).to.equal(2); // name, doc type req'd
  });

  it('should submit with all required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(<DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      uiSchema={uiSchema}
      data={{
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true
        },
        privateMedicalRecords: [{
          name: 'Test document.pdf',
          attachmentId: 'L049',
          confirmationCode: '123345asdf' }]
      }}
      formData={{}}
      onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(onSubmit.calledOnce).to.be.true;
    expect(form.find(errorClass).length).to.equal(0); // name, doc type req'd
  });
});
