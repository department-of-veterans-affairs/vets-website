import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as scrollModule from 'platform/utilities/scroll/scroll';
import {
  getFileSize,
  getFormNumber,
  getFormContent,
  handleRouteChange,
  mask,
  getPdfDownloadUrl,
  scrollAndFocusTarget,
  onCloseAlert,
  getMockData,
  formattedPhoneNumber,
  onClickContinue,
  getAlert,
} from '../../../helpers';
import * as constants from '../../../config/constants';

// All global.window.location assignments are skipped for node 22 upgrade
describe('Helpers', () => {
  describe('getFormNumber', () => {
    it('returns correct path when formNumber matches', () => {
      expect(getFormNumber('/forms/upload/21-0779/introduction')).to.eq(
        '21-0779',
      ); // ✅ Pass pathname
    });

    it('retains upper-case characters from formMappings', () => {
      expect(getFormNumber('/forms/upload/21p-0518-1/introduction')).to.eq(
        '21P-0518-1',
      );
    });

    it('returns empty string when formNumber does not match', () => {
      expect(getFormNumber('/forms/upload/fake-form/introduction')).to.eq('');
    });
  });

  describe('getFormContent', () => {
    it.skip('returns appropriate content when the form number is mapped', () => {
      global.window.location = {
        pathname: 'forms/upload/21-0779/introduction',
      };
      expect(getFormContent()).to.include({ title: 'Upload form 21-0779' });
    });
  });

  describe('getPdfDownloadUrl', () => {
    it('returns the url', () => {
      expect(getPdfDownloadUrl('21-0779')).to.eq(
        'https://www.vba.va.gov/pubs/forms/VBA-21-0779-ARE.pdf',
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

    afterEach(() => {
      scrollToSpy.restore();
    });

    it('calls scrollTo', () => {
      scrollAndFocusTarget();

      expect(scrollToSpy.calledWith('topScrollElement')).to.be.true;
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

  describe('getMockData', () => {
    const mockData = {
      mock: 'data',
    };

    it('returns the mockData', () => {
      expect(getMockData(mockData, () => true)).to.eq(mockData);
    });

    it('returns undefined', () => {
      expect(getMockData(mockData, () => false)).to.eq(undefined);
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
    });

    it('displays the uploading... alert if a file is still uploading and Continue was clicked', () => {
      const props = { data: { uploadedFile: { name: 'uploading' } } };
      const continueClicked = true;
      const stub = sinon.stub(constants, 'FORM_UPLOAD_FILE_UPLOADING_ALERT');

      getAlert(props, continueClicked);

      expect(stub.calledOnce).to.be.true;
    });

    it('displays instructions alert if no warnings and not currently uploading', () => {
      const props = { data: { uploadedFile: {} } };
      const continueClicked = false;
      const stub = sinon.stub(constants, 'FORM_UPLOAD_INSTRUCTION_ALERT');

      getAlert(props, continueClicked);

      expect(stub.calledOnce).to.be.true;
    });
  });
});
