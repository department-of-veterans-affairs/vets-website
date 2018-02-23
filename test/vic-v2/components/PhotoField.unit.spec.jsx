import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import PhotoField from '../../../src/js/vic-v2/components/PhotoField';

describe('<PhotoField>', () => {
  let oldFileReader;
  let oldImage;
  beforeEach(() => {
    window.addEventListener = sinon.spy();
    oldFileReader = global.FileReader;
    oldImage = global.Image;
  });
  afterEach(() => {
    global.Image = oldImage;
    global.FileReader = oldFileReader;
  });
  it('should render', () => {
    const formContext = {};
    const uiSchema = {
      'ui:title': 'Title',
      'ui:options': {
        fileTypes: ['jpg']
      }
    };

    const tree = shallow(
      <PhotoField
        uiSchema={uiSchema}
        formContext={formContext}/>
    );

    expect(tree.find('Cropper').exists()).to.be.false;
    expect(tree.find('Dropzone').exists()).to.be.true;
    expect(tree.text()).to.contain('Step 1');
    expect(tree.find('ErrorableFileInput').length).to.equal(2);
  });
  it('should render preview while processing', () => {
    const formContext = {};
    const uiSchema = {
      'ui:title': 'Title',
      'ui:options': {
        fileTypes: ['jpg']
      }
    };

    const tree = shallow(
      <PhotoField
        uiSchema={uiSchema}
        formData={{
          confirmationCode: 'asdfasdf'
        }}
        idSchema={{ $id: 'photo' }}
        formContext={formContext}/>
    );

    tree.instance().onPreviewError();
    tree.update();

    const text = tree.text();
    expect(tree.find('PhotoPreview').exists()).to.be.true;
    expect(text).not.to.contain('Edit your photo');
    expect(text).to.contain('Go back and change');
    expect(text).not.to.contain('Success!');
  });
  describe('screen reader path', () => {
    function FileReader() { }
    FileReader.prototype.readAsDataURL = function readAsDataURL(file) {
      this.result = file.data;
      this.onload();
    };

    it('should set error for square image', (done) => {
      const formContext = {};
      const uiSchema = {
        'ui:title': 'Title',
        'ui:options': {
          fileTypes: ['jpg']
        }
      };
      const onChange = sinon.spy();

      const tree = shallow(
        <PhotoField
          uiSchema={uiSchema}
          idSchema={{ $id: 'photo' }}
          onChange={onChange}
          formContext={formContext}/>
      );

      global.Image = class Image {
        constructor() {
          this.width = 5;
          this.height = 6;
        }
        set onload(callback) {
          callback();
        }
      };
      global.FileReader = FileReader;

      tree.find('ErrorableFileInput').last().props().onChange([{
        name: 'examplephoto.jpg',
      }]);

      setTimeout(() => {
        expect(onChange.firstCall.args[0].errorMessage).to.contain('square');
        done();
      });
    });
    it('should set error for too small image', (done) => {
      const formContext = {};
      const uiSchema = {
        'ui:title': 'Title',
        'ui:options': {
          fileTypes: ['jpg']
        }
      };
      const onChange = sinon.spy();

      const tree = shallow(
        <PhotoField
          uiSchema={uiSchema}
          idSchema={{ $id: 'photo' }}
          onChange={onChange}
          formContext={formContext}/>
      );

      global.Image = class Image {
        constructor() {
          this.width = 5;
          this.height = 5;
        }
        set onload(callback) {
          callback();
        }
      };
      global.FileReader = FileReader;

      tree.find('ErrorableFileInput').last().props().onChange([{
        name: 'examplephoto.jpg',
      }]);

      setTimeout(() => {
        expect(onChange.firstCall.args[0].errorMessage).to.contain('smaller than the');
        done();
      });
    });
    it('should set error for wrong type', (done) => {
      const formContext = {};
      const uiSchema = {
        'ui:title': 'Title',
        'ui:options': {
          fileTypes: ['jpg']
        }
      };
      const onChange = sinon.spy();

      const tree = shallow(
        <PhotoField
          uiSchema={uiSchema}
          idSchema={{ $id: 'photo' }}
          onChange={onChange}
          formContext={formContext}/>
      );

      global.Image = class Image {
        constructor() {
          this.width = 5;
          this.height = 5;
        }
        set onload(callback) {
          callback();
        }
      };
      global.FileReader = FileReader;

      tree.find('ErrorableFileInput').last().props().onChange([{
        name: 'examplephoto.png',
      }]);

      setTimeout(() => {
        expect(onChange.firstCall.args[0].errorMessage).to.contain('make sure the file you’re uploading is a gif, jpeg');
        done();
      });
    });
    it('should call uploadFile with valid image', (done) => {
      const formContext = {
        uploadFile: sinon.spy()
      };
      const uiSchema = {
        'ui:title': 'Title',
        'ui:options': {
          fileTypes: ['jpg']
        }
      };
      const onChange = sinon.spy();

      const tree = shallow(
        <PhotoField
          uiSchema={uiSchema}
          idSchema={{ $id: 'photo' }}
          onChange={onChange}
          formContext={formContext}/>
      );

      global.Image = class Image {
        constructor() {
          this.width = 400;
          this.height = 400;
        }
        set onload(callback) {
          callback();
        }
      };
      global.FileReader = FileReader;

      tree.find('ErrorableFileInput').last().props().onChange([{
        name: 'examplephoto.jpg',
      }]);

      setTimeout(() => {
        expect(formContext.uploadFile.called).to.be.true;
        done();
      });
    });
    it('should render error', () => {
      const formContext = {};
      const uiSchema = {
        'ui:title': 'Title',
        'ui:options': {
          fileTypes: ['jpg']
        }
      };

      const tree = shallow(
        <PhotoField
          uiSchema={uiSchema}
          formData={{
            errorMessage: 'Some error'
          }}
          idSchema={{ $id: 'photo' }}
          formContext={formContext}/>
      );

      tree.instance().screenReaderPath = true;
      // force a re-render
      tree.instance().forceUpdate();
      // force enzyme to actually see the above re-render
      tree.update();

      expect(tree.find('Cropper').exists()).to.be.false;
      expect(tree.find('Dropzone').exists()).to.be.false;
      expect(tree.find('.usa-input-error-message').text()).to.contain('Some error');
      expect(tree.find('ErrorableFileInput').props().buttonText).to.equal('Upload Photo Again');
    });
  });
});
