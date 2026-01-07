import sinon from 'sinon';
import { expect } from 'chai';
import * as scrollModule from 'platform/utilities/scroll/scroll';
import { shallow } from 'enzyme';
import {
  getFileSize,
  getFormNumber,
  getFormContent,
  handleRouteChange,
  mask,
  getPdfDownloadUrl,
  scrollAndFocusTarget,
  onCloseAlert,
  formattedPhoneNumber,
  onClickContinue,
  getAlert,
  parseResponse,
  createPayload,
  maskVaFileNumber,
  addStyleToShadowDomOnPages,
} from '../../../helpers';
import * as constants from '../../../config/constants';

describe('Helpers', () => {
  describe('getFormNumber', () => {
    it('returns correct path when formNumber matches', () => {
      // Passing pathname directly to avoid window.location issues across Node versions
      // TODO: Add window.location tests once platform completes migration to Node 22
      // global.window.location.href = 'http://localhost/representative/representative-form-upload/21-686c/upload';
      // expect(getFormNumber()).to.eq('21-686c');
      const pathname =
        '/representative/representative-form-upload/submit-va-form-21-686c/upload-files';
      expect(getFormNumber(pathname)).to.eq('21-686c');
    });

    // put back in when we have a form with upper-case characters
    // it('retains upper-case characters from formMappings', () => {
    //   global.window.location.href =
    //     'http://localhost/representative/representative-form-upload/21-686c/upload';
    //   expect(getFormNumber()).to.eq('21P-0518-1');
    // });

    it('returns empty string when formNumber does not match', () => {
      const pathname =
        '/representative/representative-form-upload/fake-form/upload';
      expect(getFormNumber(pathname)).to.eq('');
    });
  });

  describe('getFormContent', () => {
    it('returns appropriate content when the form number is mapped', () => {
      const pathname =
        '/representative/representative-form-upload/submit-va-form-21-686c/upload-files';
      expect(getFormContent(pathname)).to.include({ title: 'VA Form 21-686c' });
    });
  });

  describe('getPdfDownloadUrl', () => {
    it('returns the url', () => {
      expect(getPdfDownloadUrl('21-686c')).to.eq(
        'https://www.vba.va.gov/pubs/forms/VBA-21-686c-ARE.pdf',
      );
    });

    it('returns an empty string', () => {
      expect(getPdfDownloadUrl()).to.eq('');
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

  describe('scrollAndFocusTarget', () => {
    let scrollToSpy;

    beforeEach(() => {
      scrollToSpy = sinon.stub(scrollModule, 'scrollTo');
    });

    it('calls scrollTo', () => {
      scrollAndFocusTarget();
      expect(scrollToSpy.calledWith('topScrollElement')).to.be.true;
    });

    afterEach(() => {
      scrollToSpy.restore();
    });
  });

  describe('mask', () => {
    it('should return a masked string', () => {
      const node = shallow(mask('secret-stuf'));

      expect(node.text()).to.contain('●●●–●●–stuf');

      node.unmount();
    });
  });

  describe('onCloseAlert', () => {
    it('sets e.target.visible to false', () => {
      const e = {
        target: {
          visible: true,
        },
      };

      onCloseAlert(e);

      expect(e.target.visible).to.eq(false);
    });
  });

  describe('formattedPhoneNumber', () => {
    it('formats the phone number', () => {
      expect(formattedPhoneNumber('12345-67890')).to.eq('(123) 456-7890');
    });
  });

  describe('onClickContinue', () => {
    it('sets continueClicked to true', () => {
      const props = {
        data: {
          uploadedFile: { name: 'uploading' },
        },
      };
      const setContinueClicked = sinon.spy();

      onClickContinue(props, setContinueClicked);

      expect(setContinueClicked.calledOnce).to.be.true;
    });

    it('calls onContinue if file is not currently uploading', () => {
      const onContinue = sinon.spy();
      const props = {
        data: {
          uploadedFile: { name: 'file-name' },
        },
        onContinue,
      };

      onClickContinue(props, () => {});

      expect(onContinue.calledOnce).to.be.true;
    });
  });

  describe('getAlert', () => {
    it('displays the OCR alert if there are warnings', () => {
      const props = { data: { uploadedFile: { warnings: ['warning'] } } };
      const continueClicked = false;
      const stub = sinon.stub(constants, 'FORM_UPLOAD_OCR_ALERT');

      getAlert(props, continueClicked);

      expect(stub.calledOnce).to.be.true;

      stub.restore();
    });

    it('displays the uploading... alert if a file is still uploading and Continue was clicked', () => {
      const props = { data: { uploadedFile: { name: 'uploading' } } };
      const continueClicked = true;
      const stub = sinon.stub(constants, 'FORM_UPLOAD_FILE_UPLOADING_ALERT');

      getAlert(props, continueClicked);

      expect(stub.calledOnce).to.be.true;

      stub.restore();
    });

    it('displays instructions alert if no warnings and not currently uploading', () => {
      const props = { data: { uploadedFile: {} }, name: 'uploadPage' };
      const continueClicked = false;
      const stub = sinon.stub(constants, 'FORM_UPLOAD_INSTRUCTION_ALERT');

      getAlert(props, continueClicked);

      expect(stub.calledOnce).to.be.true;

      stub.restore();
    });
  });

  describe('parseResponse', () => {
    it('extracts name, confirmationCode, and size from response', () => {
      const mockData = {
        data: {
          attributes: {
            name: 'test.pdf',
            confirmationCode: 'ABC123',
            size: 12345,
          },
        },
      };

      const result = parseResponse(mockData);

      expect(result).to.deep.equal({
        name: 'test.pdf',
        confirmationCode: 'ABC123',
        size: 12345,
      });
    });
  });

  describe('createPayload', () => {
    it('creates a FormData with form_id and file', () => {
      const blob = new Blob(['content']);
      const file = new File([blob], 'test.txt', { type: 'text/plain' });
      const formId = '21-686c';

      const payload = createPayload(file, formId);

      expect(payload.get('form_id')).to.equal(formId);

      const fileFromFormData = payload.get('file');
      expect(fileFromFormData).to.have.property('type', 'text/plain');
      expect(fileFromFormData).to.have.property('size', file.size);
    });

    it('appends password if provided', () => {
      const file = new Blob(['content'], { type: 'text/plain' });
      const formId = '21-686c';

      const payload = createPayload(file, formId, 'secret');

      expect(payload.get('password')).to.equal('secret');
    });
  });

  describe('maskVaFileNumber', () => {
    it('returns empty string if no vaFileNumber', () => {
      expect(maskVaFileNumber()).to.equal('');
    });

    it('returns masked 8-digit number', () => {
      expect(maskVaFileNumber('12345678')).to.equal('●●●●5678');
    });

    it('returns masked longer number', () => {
      expect(maskVaFileNumber('123456789')).to.equal('●●●●●6789');
    });
  });

  describe('addStyleToShadowDomOnPages', () => {
    let originalHref;

    before(() => {
      originalHref = window.location.href;
      global.window.location.href = 'http://localhost/test-page';
    });

    it('does not throw if no matching URL', async () => {
      await addStyleToShadowDomOnPages(['non-matching-url'], [], 'body { }');
    });

    it('runs silently if no elements found', async () => {
      await addStyleToShadowDomOnPages(
        ['test-page'],
        ['non-existent'],
        'body { }',
      );
    });

    after(() => {
      global.window.location.href = originalHref;
    });
  });
});
