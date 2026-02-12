import * as apiUtils from '@department-of-veterans-affairs/platform-utilities/api';
import { expect } from 'chai';
import sinon from 'sinon';
import * as constants from '../../constants';
import { mockSubmitResponse } from '../../utils/mockData';
import {
  convertDate,
  deleteStoredFile,
  getAttachmentDisplayData,
  getSchoolString,
  getStoredAttachments,
  getYesOrNoFromBool,
  handleChapterToggle,
  handleDataUpdate,
  handleEditMode,
  handleFormSubmission,
  handleSectionEdit,
  maskSocial,
  scrollToElement,
  submitFormData,
} from '../../utils/reviewPageUtils';
import { askVAAttachmentStorage } from '../../utils/StorageAdapter';

describe('Review Page Utils', () => {
  describe('getYesOrNoFromBool', () => {
    it('should return "Yes" for true', () => {
      expect(getYesOrNoFromBool(true)).to.equal('Yes');
    });

    it('should return "No" for false', () => {
      expect(getYesOrNoFromBool(false)).to.equal('No');
    });
  });

  describe('convertDate', () => {
    it('should convert YYYY-MM-DD to long date format', () => {
      expect(convertDate('2024-03-12')).to.equal('March 12, 2024');
    });

    it('should handle single-digit months and days', () => {
      expect(convertDate('2024-01-05')).to.equal('January 5, 2024');
    });

    it('should return null for invalid input', () => {
      expect(convertDate('')).to.be.null;
      expect(convertDate(null)).to.be.null;
      expect(convertDate(undefined)).to.be.null;
    });
  });

  describe('maskSocial', () => {
    it('should mask SSN showing only last 4 digits', () => {
      expect(maskSocial('123456789')).to.equal('•••-••-6789');
    });

    it('should return null for invalid input', () => {
      expect(maskSocial('')).to.be.null;
      expect(maskSocial(null)).to.be.null;
      expect(maskSocial(undefined)).to.be.null;
    });
  });

  describe('getSchoolString', () => {
    it('should combine school code and name', () => {
      expect(getSchoolString('12345', 'Test School')).to.equal(
        '12345 - Test School',
      );
    });

    it('should return null if either code or name is missing', () => {
      expect(getSchoolString('12345', '')).to.be.null;
      expect(getSchoolString('', 'Test School')).to.be.null;
      expect(getSchoolString(null, 'Test School')).to.be.null;
      expect(getSchoolString('12345', null)).to.be.null;
    });
  });

  describe('getAttachmentDisplayData', () => {
    it('should handle empty attachments list', () => {
      const result = getAttachmentDisplayData([]);
      expect(result.hasAttachments).to.be.false;
      expect(result.displayData).to.be.null;
    });

    it('should handle undefined attachments', () => {
      const result = getAttachmentDisplayData();
      expect(result.hasAttachments).to.be.false;
      expect(result.displayData).to.be.null;
    });

    it('should format attachment data correctly', () => {
      const attachments = [
        {
          fileID: '123',
          fileName: 'test.pdf',
          fileSize: '1 MB',
          base64: 'data:base64',
        },
      ];
      const result = getAttachmentDisplayData(attachments);
      expect(result.hasAttachments).to.be.true;
      expect(result.displayData).to.deep.equal([
        {
          id: '123',
          name: 'test.pdf',
          size: '1 MB',
          base64: 'data:base64',
        },
      ]);
    });
  });

  describe('Storage Operations', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    describe('getStoredAttachments', () => {
      it('should return stored attachments', async () => {
        const mockFiles = [{ fileID: '123', fileName: 'test.pdf' }];
        sandbox.stub(askVAAttachmentStorage, 'get').resolves(mockFiles);

        const result = await getStoredAttachments();
        expect(result).to.deep.equal(mockFiles);
      });

      it('should return empty array if no attachments found', async () => {
        sandbox.stub(askVAAttachmentStorage, 'get').resolves(null);

        const result = await getStoredAttachments();
        expect(result).to.deep.equal([]);
      });

      it('should handle storage errors', async () => {
        sandbox
          .stub(askVAAttachmentStorage, 'get')
          .rejects(new Error('Storage error'));

        const result = await getStoredAttachments();
        expect(result).to.deep.equal([]);
      });
    });

    describe('deleteStoredFile', () => {
      it('should remove file and update storage', async () => {
        const mockFiles = [
          { fileID: '123', fileName: 'test1.pdf' },
          { fileID: '456', fileName: 'test2.pdf' },
        ];
        sandbox.stub(askVAAttachmentStorage, 'get').resolves(mockFiles);
        const setStub = sandbox.stub(askVAAttachmentStorage, 'set');

        const result = await deleteStoredFile('123');
        expect(result).to.deep.equal([
          { fileID: '456', fileName: 'test2.pdf' },
        ]);
        expect(setStub.calledOnce).to.be.true;
      });

      it('should handle non-existent file ID', async () => {
        const mockFiles = [{ fileID: '123', fileName: 'test.pdf' }];
        sandbox.stub(askVAAttachmentStorage, 'get').resolves(mockFiles);
        const setStub = sandbox.stub(askVAAttachmentStorage, 'set');

        const result = await deleteStoredFile('456');
        expect(result).to.deep.equal(mockFiles);
        expect(setStub.calledOnce).to.be.false;
      });

      it('should handle storage errors', async () => {
        sandbox
          .stub(askVAAttachmentStorage, 'get')
          .rejects(new Error('Storage error'));

        const result = await deleteStoredFile('123');
        expect(result).to.deep.equal([]);
      });
    });
  });

  describe('scrollToElement', () => {
    let originalWindow;

    beforeEach(() => {
      originalWindow = global.window;
      delete global.window;
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it('should return default scroll options if Forms.scroll is not defined', () => {
      const result = scrollToElement('testElement');
      expect(result).to.deep.equal({
        duration: 500,
        delay: 2,
        smooth: true,
      });
    });

    it('should merge custom options with defaults', () => {
      const customOptions = {
        duration: 300,
        offset: 100,
      };
      const result = scrollToElement('testElement', customOptions);
      expect(result).to.deep.equal({
        duration: 300,
        delay: 2,
        smooth: true,
        offset: 100,
      });
    });

    it('should return Forms.scroll if defined', () => {
      const mockScroll = { duration: 300, delay: 0, smooth: false };
      global.window = { Forms: { scroll: mockScroll } };

      const result = scrollToElement('testElement');
      expect(result).to.deep.equal(mockScroll);
    });
  });

  describe('handleChapterToggle', () => {
    it('should return close action when chapter is open', () => {
      const result = handleChapterToggle(true, 'chapter1', ['page1', 'page2']);
      expect(result).to.deep.equal({
        shouldClose: true,
        chapterName: 'chapter1',
        affectedPages: ['page1', 'page2'],
      });
    });

    it('should return open action when chapter is closed', () => {
      const result = handleChapterToggle(false, 'chapter1', ['page1', 'page2']);
      expect(result).to.deep.equal({
        shouldClose: false,
        chapterName: 'chapter1',
        affectedPages: ['page1', 'page2'],
      });
    });

    it('should handle empty pageKeys', () => {
      const result = handleChapterToggle(true, 'chapter1', []);
      expect(result).to.deep.equal({
        shouldClose: true,
        chapterName: 'chapter1',
        affectedPages: [],
      });
    });

    it('should handle undefined pageKeys', () => {
      const result = handleChapterToggle(true, 'chapter1');
      expect(result).to.deep.equal({
        shouldClose: true,
        chapterName: 'chapter1',
        affectedPages: undefined,
      });
    });
  });

  describe('handleEditMode', () => {
    it('should handle edit mode with all options', () => {
      const options = {
        setViewedPages: sinon.spy(),
        setEditMode: sinon.spy(),
        setUpdatedInReview: sinon.spy(),
      };

      const result = handleEditMode('testPage', true, null, options);
      expect(result).to.equal('testPage');
      expect(options.setViewedPages.calledWith(['testPage'])).to.be.true;
      expect(options.setEditMode.calledWith('testPage', true, null)).to.be.true;
      expect(options.setUpdatedInReview.calledWith('')).to.be.true;
    });

    it('should handle closing edit mode', () => {
      const options = {
        setViewedPages: sinon.spy(),
        setEditMode: sinon.spy(),
        setUpdatedInReview: sinon.spy(),
      };

      handleEditMode('testPage', false, null, options);
      expect(options.setEditMode.calledWith('testPage', false, null)).to.be
        .true;
      expect(options.setUpdatedInReview.calledWith('testPage')).to.be.true;
    });

    it('should handle index in page key', () => {
      const options = {
        setViewedPages: sinon.spy(),
        setEditMode: sinon.spy(),
      };

      const result = handleEditMode('testPage', true, 1, options);
      expect(result).to.equal('testPage1');
    });
  });

  describe('handleSectionEdit', () => {
    it('should handle editing special sections', () => {
      const onEdit = sinon.spy();
      const result = handleSectionEdit('edit', {
        pageKeys: ['page1', 'page2'],
        title: 'Your Contact Information',
        editSection: [],
        onEdit,
      });

      expect(result).to.deep.equal(['Your Contact Information']);
      expect(onEdit.calledOnce).to.be.true;
      expect(onEdit.calledWith('page1', true, null)).to.be.true;
    });

    it('should handle editing regular sections', () => {
      const onEdit = sinon.spy();
      const result = handleSectionEdit('edit', {
        pageKeys: ['page1', 'page2'],
        title: 'Regular Section',
        editSection: [],
        onEdit,
      });

      expect(result).to.deep.equal(['Regular Section']);
      expect(onEdit.calledTwice).to.be.true;
      expect(onEdit.firstCall.calledWith('page1', true, null)).to.be.true;
      expect(onEdit.secondCall.calledWith('page2', true, null)).to.be.true;
    });

    it('should handle closing sections', () => {
      const onEdit = sinon.spy();
      const result = handleSectionEdit('close', {
        pageKeys: ['page1', 'page2'],
        title: 'Test Section',
        editSection: ['Test Section', 'Other Section'],
        onEdit,
      });

      expect(result).to.deep.equal(['Other Section']);
      expect(onEdit.calledTwice).to.be.true;
      expect(onEdit.firstCall.calledWith('page1', false)).to.be.true;
      expect(onEdit.secondCall.calledWith('page2', false)).to.be.true;
    });
  });

  describe('Form Submission', () => {
    let sandbox;
    let originalMockFlag;
    let originalEnvUrl;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      originalMockFlag = constants.mockTestingFlagForAPI;
      originalEnvUrl = constants.envUrl;

      Object.defineProperty(constants, 'envUrl', {
        value: 'http://localhost:3000',
        configurable: true,
        writable: true,
      });

      Object.defineProperty(constants, 'mockTestingFlagForAPI', {
        value: true,
        configurable: true,
        writable: true,
      });
    });

    afterEach(() => {
      sandbox.restore();

      Object.defineProperty(constants, 'mockTestingFlagForAPI', {
        value: originalMockFlag,
        configurable: true,
        writable: true,
      });

      Object.defineProperty(constants, 'envUrl', {
        value: originalEnvUrl,
        configurable: true,
        writable: true,
      });
    });

    describe('submitFormData', () => {
      it('should handle successful submission', async () => {
        const onSuccess = sinon.spy();
        const expectedResponse = {
          success: true,
          inquiryNumber: 'A-20230622-306458',
        };

        sandbox.stub(apiUtils, 'apiRequest').resolves(expectedResponse);

        await submitFormData({
          url: 'test-url',
          data: { test: true },
          onSuccess,
        });

        expect(onSuccess.calledOnce).to.be.true;
        expect(onSuccess.calledWith(expectedResponse)).to.be.true;
      });

      it('should handle mock mode', async () => {
        const onSuccess = sinon.spy();
        const result = await submitFormData({
          url: 'test-url',
          data: { test: true },
          onSuccess,
          mockEnabled: true,
        });

        await new Promise(resolve => setTimeout(resolve, 600));

        expect(result).to.deep.equal(mockSubmitResponse);
        expect(onSuccess.calledWith(mockSubmitResponse)).to.be.true;
      });

      it('should call onError for a response that does not include a inquiryNumber property', async () => {
        const onError = sinon.spy();

        sandbox.stub(apiUtils, 'apiRequest').resolves({ success: true });

        try {
          await submitFormData({
            url: 'test-url',
            data: { test: true },
            onError,
          });
        } catch (e) {
          expect(e.message).to.equal(
            `Backend API call failed. Inquiry number not found.`,
          );
          expect(onError.calledOnce).to.be.true;
          expect(onError.firstCall.args[0].message).to.equal(
            `Backend API call failed. Inquiry number not found.`,
          );
        }
      });
    });

    describe('handleFormSubmission', () => {
      it('should handle successful submission', async () => {
        const formData = {
          test: true,
          contactPreference: 'Email',
          stateOfTheSchool: 'CA',
        };

        const onSuccess = sinon.spy();
        const onError = sinon.spy();

        await handleFormSubmission({
          formData,
          isLoggedIn: true,
          isUserLOA3: true,
          onSuccess,
          onError,
        });

        const expectedResponse = {
          inquiryNumber: 'A-20230622-306458',
          contactPreference: 'Email',
        };

        expect(onSuccess.calledOnce).to.be.true;
        expect(onSuccess.calledWith(expectedResponse)).to.be.true;
        expect(onError.notCalled).to.be.true;
      });

      it('should handle submission with default contact preference', async () => {
        const formData = {
          test: true,
          stateOfTheSchool: 'CA',
        };

        const onSuccess = sinon.spy();
        const onError = sinon.spy();

        await handleFormSubmission({
          formData,
          isLoggedIn: true,
          isUserLOA3: true,
          onSuccess,
          onError,
        });

        const expectedResponse = {
          inquiryNumber: 'A-20230622-306458',
          contactPreference: 'Email',
        };

        expect(onSuccess.calledOnce).to.be.true;
        expect(onSuccess.calledWith(expectedResponse)).to.be.true;
        expect(onError.notCalled).to.be.true;
      });

      it('should handle submission errors', async () => {
        const onError = sinon.spy();
        const error = new Error('Submission Error');
        sandbox.stub(askVAAttachmentStorage, 'get').rejects(error);

        await handleFormSubmission({
          formData: { test: true },
          onError,
        });

        expect(onError.calledWith(error)).to.be.true;
      });
    });
  });

  describe('handleDataUpdate', () => {
    it('should update data and call callback', () => {
      const setData = sinon.spy();
      const onSetData = sinon.spy();
      const args = ['test', true];

      handleDataUpdate(setData, args, onSetData);

      expect(setData.calledWith('test', true)).to.be.true;
      expect(onSetData.calledOnce).to.be.true;
    });

    it('should handle missing callback', () => {
      const setData = sinon.spy();
      const args = ['test', true];

      handleDataUpdate(setData, args);

      expect(setData.calledWith('test', true)).to.be.true;
    });
  });
});
