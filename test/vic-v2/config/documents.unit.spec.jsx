import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/vic-v2/config/form.js';

describe('VIC document upload', () => {
  const page = formConfig.chapters.documentUpload.pages.dd214Upload;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );

    expect(form.find('input').length).to.equal(1);
  });


  it('should not submit without required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('it should reject an invalid file', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          photo: {
            errorMessage: 'File is not one of the allowed types'
          }
        }}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });


  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = mount(<DefinitionTester
      schema={schema}
      data={{
        dd214: [{
          confirmationCode: 'testing',
          name: 'test.pdf'
        }, {
          confirmationCode: 'testing2',
          name: 'test.pdf'
        }]
      }}
      definitions={formConfig.defaultDefinitions}
      onSubmit={onSubmit}
      uiSchema={uiSchema}/>
    );


    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
  });
});
