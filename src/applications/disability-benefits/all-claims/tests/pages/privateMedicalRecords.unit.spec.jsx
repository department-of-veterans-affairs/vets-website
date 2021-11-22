import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('526 All Claims Private medical records', () => {
  const errorClass = '.usa-input-error-message';
  const page =
    formConfig.chapters.supportingEvidence.pages.privateMedicalRecords;
  const { schema, uiSchema } = page;

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
    form.unmount();
  });

  it('should submit when user selects "yes" to upload', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': true,
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

  // TODO: This will change once 4142 is integrated
  it('should submit when user selects "no" to upload', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': false,
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
});
