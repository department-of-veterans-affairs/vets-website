import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillData } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/vic-v2/config/form.js';


describe('VIC photo upload', () => {
  const page = formConfig.chapters.documentUpload.pages.photoUpload;
  const { schema, uiSchema } = page;
  const globalWindow = window;
  window =  { addEventListener: sinon.spy() }; // eslint-disable-line no-global-assign
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );

    expect(form.find('input').length).to.equal(2);
  });

  // Disabled pending PR 7175 
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

    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });

  // Sighted path
  // Disabled pending PR 7175 
  it('it should reject an invalid file type', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          photo: {
            errorMessage: 'The file you selected is smaller than the 350px minimum file width or height and could not be added.'
          }
        }}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    // form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(1);
    // expect(onSubmit.called).to.be.false;
  });

  // it/ should accept a valid file and render the cropper

  // it/ should allow the user to upload a new file
  // it/ should display a warning when the image is fully zoomed in

  // it/ should crop a photo and render the preview

  // it/ should all the user to return to the cropper from preview

  // it/ should allow the user to upload a new photo
  // it/ should display an error if upload fails
  // it/ should display a progres indicator while the file is uploading

  // it/ should submit with a valid photo

  // non-sighted path
  // it/ should display an errorfor an invalid file
  // it/ should accept valid file and render the preview
  // it/ should not allow the user to edit their photo
  // it/ should submit with a valid photo
  it('should submit with all info filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );

    fillData(form, 'input[name="root_email"]', 'test@test.com');
    fillData(form, 'input[name="root_view:confirmEmail"]', 'test@test.com');
    fillData(form, 'input[name="root_phone"]', '4445556767');
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  window = globalWindow; // eslint-disable-line no-global-assign

});
