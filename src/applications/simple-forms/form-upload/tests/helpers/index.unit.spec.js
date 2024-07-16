import sinon from 'sinon';
import { expect } from 'chai';
import * as actions from 'platform/forms-system/src/js/actions';
import * as api from '@department-of-veterans-affairs/platform-utilities/api';
import { shallow } from 'enzyme';
import {
  createPayload,
  getFileSize,
  getFormSubtitle,
  handleRouteChange,
  mask,
  submitForm,
  uploadScannedForm,
} from '../../helpers';

describe('Helpers', () => {
  describe('getFormUploadContent', () => {
    it('returns the empty string when formNumber does not match', () => {
      expect(getFormSubtitle('fake-form')).to.eq('');
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

  describe('createPayload', () => {
    it('should return the appropriate payload', () => {
      const formId = '21-0779';
      const file = {};

      const payload = createPayload(file, formId);

      expect(payload.get('form_id')).to.eq(formId);
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

  describe('submitForm', () => {
    it('should make an api request', () => {
      const apiRequestStub = sinon.stub(api, 'apiRequest').resolves({});
      const formNumber = '21-0779';
      const confirmationCode = 'some-confirmation-code';
      const history = [];

      submitForm(formNumber, confirmationCode, history);

      expect(apiRequestStub.called).to.be.true;
    });
  });

  describe('mask', () => {
    it('should return a masked string', () => {
      const node = shallow(mask('secret-stuf'));

      expect(node.text()).to.contain('●●●–●●–stuf');

      node.unmount();
    });
  });
});
