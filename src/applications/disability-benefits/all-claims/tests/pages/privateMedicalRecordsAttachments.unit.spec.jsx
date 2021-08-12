import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('526 All Claims Private medical records', () => {
  const errorClass = '.usa-input-error-message';
  const page =
    formConfig.chapters.supportingEvidence.pages
      .privateMedicalRecordsAttachments;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

    expect(
      form.find('#root_privateMedicalRecordAttachments_add_label').length,
    ).to.equal(1);
    form.unmount();
  });

  it('should expand upload when "yes" option selected', () => {
    const form = mount(
      <Provider store={uploadStore}>
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
        />
      </Provider>,
    );

    expect(
      form.find('#root_privateMedicalRecordAttachments_add_label').length,
    ).to.equal(1);
    form.unmount();
  });

  it('should not submit without an upload if one indicated', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
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
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.false;
    expect(form.find(errorClass).length).to.equal(1); // upload at least 1 doc
    form.unmount();
  });

  it('should not submit without additional upload info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            'view:uploadPrivateRecordsQualifier': {
              'view:hasPrivateRecordsToUpload': true,
            },
            privateMedicalRecordAttachments: [
              { confirmationCode: '123345asdf' },
            ],
          }}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.false;
    expect(form.find(errorClass).length).to.equal(1); // name, doc type req'd
    form.unmount();
  });

  it('should submit with all required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            'view:uploadPrivateRecordsQualifier': {
              'view:hasPrivateRecordsToUpload': true,
            },
            privateMedicalRecordAttachments: [
              {
                name: 'Test document.pdf',
                attachmentId: 'L107',
                confirmationCode: '123345asdf',
              },
            ],
          }}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.calledOnce).to.be.true;
    expect(form.find(errorClass).length).to.equal(0); // name, doc type req'd
    form.unmount();
  });
});
