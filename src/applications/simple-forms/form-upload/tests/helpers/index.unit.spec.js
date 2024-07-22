import sinon from 'sinon';
import { expect } from 'chai';
import * as actions from 'platform/forms-system/src/js/actions';
import { shallow } from 'enzyme';
import {
  getFileSize,
  getFormNumber,
  getFormContent,
  handleRouteChange,
  mask,
  uploadScannedForm,
} from '../../helpers';

describe('Helpers', () => {
  describe('getFormNumber', () => {
    it('returns correct path when formNumber matches', () => {
      global.window.location = {
        pathname: '/form-upload/21-0779/upload',
      };
      expect(getFormNumber()).to.eq('21-0779');
    });

    it('returns empty string when formNumber does not match', () => {
      global.window.location = {
        pathname: '/form-upload/fake-form/upload',
      };
      expect(getFormNumber()).to.eq('');
    });
  });

  describe('getFormContent', () => {
    it('returns appropriate content when the form number is mapped', () => {
      global.window.location = {
        pathname: '/form-upload/21-0779/upload',
      };
      expect(getFormContent()).to.include({ title: 'Upload VA Form 21-0779' });
    });

    it('returns default content when the form number is not mapped', () => {
      global.window.location = {
        pathname: '/form-upload/99-9999/upload',
      };
      expect(getFormContent()).to.include({ title: 'Upload VA Form 99-9999' });
    });
  });

  describe('getFileSize', () => {
    it('should be in bytes for values < 999', () => {
      expect(getFileSize(998)).to.equal('998 B');
    });
    it('should be in KB for values between a thousand and a million', () => {
      expect(getFileSize(1024)).to.equal('1 KB');
    });
    it('should be in MB for values greater than a million', () => {
      expect(getFileSize(2000000)).to.equal('2.0 MB');
    });
  });

  describe('mask', () => {
    it('should return a masked string', () => {
      const node = shallow(mask('secret-stuf'));

      expect(node.text()).to.contain('●●●–●●–stuf');

      node.unmount();
    });
  });

  describe('uploadScannedForm', () => {
    it('should call uploadFile', () => {
      const uploadFileStub = sinon
        .stub(actions, 'uploadFile')
        .returns(() => {});
      const formNumber = '21-0779';
      const fileToUpload = {};
      const onFileUploaded = () => {};
      const dispatch = uploadScannedForm(
        formNumber,
        fileToUpload,
        onFileUploaded,
      );

      dispatch();

      expect(uploadFileStub.called).to.be.true;
    });
  });

  describe('handleRouteChange', () => {
    it('pushes the href to history', () => {
      const fakeHref = 'fake-href';
      const history = {
        push(_) {},
      };
      const historySpy = sinon.spy(history, 'push');
      const route = { detail: { href: fakeHref } };

      handleRouteChange(route, history);

      expect(historySpy.calledWith(fakeHref)).to.be.true;
    });
  });
});
