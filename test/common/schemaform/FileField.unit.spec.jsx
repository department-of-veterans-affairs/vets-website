import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, getFormDOM } from '../../util/schemaform-utils.jsx';

import FileField from '../../../src/js/common/schemaform/FileField';
import fileUploadUI, { fileSchema } from '../../../src/js/common/schemaform/definitions/file';

const formContext = {
  setTouched: sinon.spy()
};
const requiredSchema = {};

describe('Schemaform <FileField>', () => {
  it('should render', () => {
    const idSchema = {
      $id: 'field'
    };
    const schema = {};
    const uiSchema = fileUploadUI('Files');
    const tree = SkinDeep.shallowRender(
      <FileField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}/>
    );

    expect(tree.everySubTree('label')[0].text()).to.contain('Upload');
  });
  it('should render files', () => {
    const idSchema = {
      $id: 'field'
    };
    const schema = {};
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        confirmationCode: 'asdfds',
        name: 'Test file name'
      }
    ];
    const tree = SkinDeep.shallowRender(
      <FileField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}/>
    );

    expect(tree.subTree('li').text()).to.contain('Test file name');
    expect(tree.subTree('.usa-button-outline').text()).to.contain('Edit');
  });

  it('should render uploading', () => {
    const idSchema = {
      $id: 'field'
    };
    const schema = {};
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        uploading: true
      }
    ];
    const tree = SkinDeep.shallowRender(
      <FileField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}/>
    );

    expect(tree.everySubTree('ProgressBar')).not.to.be.empty;
    expect(tree.everySubTree('button')).to.be.empty;
  });

  it('should update progress', () => {
    const idSchema = {
      $id: 'field'
    };
    const schema = {};
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        uploading: true
      }
    ];
    const tree = SkinDeep.shallowRender(
      <FileField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}/>
    );

    expect(tree.subTree('ProgressBar').props.percent).to.equal(0);

    tree.getMountedInstance().updateProgress(20);

    expect(tree.subTree('ProgressBar').props.percent).to.equal(20);
  });
  it('should render error', () => {
    const idSchema = {
      $id: 'field'
    };
    const schema = {};
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        errorMessage: 'asdfas'
      }
    ];
    const errorSchema = {
      0: {
        __errors: [
          'Bad error'
        ]
      }
    };
    const tree = SkinDeep.shallowRender(
      <FileField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        errorSchema={errorSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}/>
    );

    expect(tree.subTree('.va-growable-background').text()).to.contain('Bad error');
  });

  it('should not render upload button if over max items', () => {
    const idSchema = {
      $id: 'field'
    };
    const schema = {
      maxItems: 1
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        confirmationCode: 'asdfds',
        name: 'Test file name'
      }
    ];
    const tree = SkinDeep.shallowRender(
      <FileField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}/>
    );

    expect(tree.everySubTree('label')).to.be.empty;
  });
  it('should show edit state', () => {
    const uiSchema = fileUploadUI('Files');
    const schema = {
      type: 'object',
      properties: {
        fileField: fileSchema
      }
    };
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{
          fileField: [
            {
              confirmationCode: 'asdfasfd'
            }
          ]
        }}
        uiSchema={{
          fileField: uiSchema
        }}/>
    );
    const formDOM = getFormDOM(form);

    formDOM.click('button.usa-button-outline');

    const buttons = formDOM.querySelectorAll('.usa-button');
    expect(buttons.length).to.equal(2);
    expect(buttons[0].textContent).to.equal('Replace');
    expect(buttons[1].textContent).to.equal('Cancel');
    expect(formDOM.querySelector('.va-growable-background a').textContent).to.equal('Delete file');
  });

  it('should delete file', () => {
    const uiSchema = fileUploadUI('Files');
    const schema = {
      type: 'object',
      properties: {
        fileField: fileSchema
      }
    };
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{
          fileField: [
            {
              confirmationCode: 'asdfasfd'
            }
          ]
        }}
        uiSchema={{
          fileField: uiSchema
        }}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('li')).not.to.be.empty;

    formDOM.click('button.usa-button-outline');
    formDOM.click('.va-growable-background a');

    expect(formDOM.querySelectorAll('li')).to.be.empty;
  });

  it('should upload file', () => {
    const uiSchema = fileUploadUI('Files');
    const schema = {
      type: 'object',
      properties: {
        fileField: fileSchema
      }
    };
    const uploadFile = sinon.stub().returns(Promise.resolve());
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{
          fileField: []
        }}
        uploadFile={uploadFile}
        uiSchema={{
          fileField: uiSchema
        }}/>
    );
    const formDOM = getFormDOM(form);

    formDOM.files('input[type=file]', [{}]);

    expect(uploadFile.firstCall.args[0]).to.eql({});
    expect(uploadFile.firstCall.args[1]).to.eql(['fileField', 0]);
    expect(uploadFile.firstCall.args[2]).to.eql(uiSchema['ui:options']);
    expect(uploadFile.firstCall.args[3]).to.be.a('function');
  });
});
