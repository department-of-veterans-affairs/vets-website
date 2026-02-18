import { expect } from 'chai';
import sinon from 'sinon';

import {
  isLoggedInVeteran,
  isNotLoggedInVeteran,
  isLoggedInVeteranPreparer,
  isNotLoggedInVeteranPreparer,
  createOpenRemoveModal,
  createCloseRemoveModal,
  createCancelUpload,
} from '../../utils/helpers2';

import * as helpers from '../../utils/helpers';

describe('Pre-need integration helpers2', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('isLoggedInVeteran', () => {
    it('should return true when user is logged in veteran and not authorized agent', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const formData = {
        'view:loginState': {
          isLoggedIn: true,
        },
      };

      const result = isLoggedInVeteran(formData);
      expect(result).to.be.true;
    });

    it('should return false when user is not logged in', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const formData = {
        'view:loginState': {
          isLoggedIn: false,
        },
      };

      const result = isLoggedInVeteran(formData);
      expect(result).to.be.false;
    });

    it('should return false when user is not a veteran', () => {
      sandbox.stub(helpers, 'isVeteran').returns(false);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const formData = {
        'view:loginState': {
          isLoggedIn: true,
        },
      };

      const result = isLoggedInVeteran(formData);
      expect(result).to.be.false;
    });

    it('should return false when user is an authorized agent', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(true);

      const formData = {
        'view:loginState': {
          isLoggedIn: true,
        },
      };

      const result = isLoggedInVeteran(formData);
      expect(result).to.be.false;
    });

    it('should return false when view:loginState is missing', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const result = isLoggedInVeteran({});
      expect(result).to.be.false;
    });

    it('should return false when formData is null', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const result = isLoggedInVeteran(null);
      expect(result).to.be.false;
    });

    it('should return false when formData is undefined', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const result = isLoggedInVeteran(undefined);
      expect(result).to.be.false;
    });
  });

  describe('isNotLoggedInVeteran', () => {
    it('should return true when user is veteran, not logged in, and not authorized agent', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const formData = {
        'view:loginState': {
          isLoggedIn: false,
        },
      };

      const result = isNotLoggedInVeteran(formData);
      expect(result).to.be.true;
    });

    it('should return false when user is logged in', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const formData = {
        'view:loginState': {
          isLoggedIn: true,
        },
      };

      const result = isNotLoggedInVeteran(formData);
      expect(result).to.be.false;
    });

    it('should return false when user is not a veteran', () => {
      sandbox.stub(helpers, 'isVeteran').returns(false);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const formData = {
        'view:loginState': {
          isLoggedIn: false,
        },
      };

      const result = isNotLoggedInVeteran(formData);
      expect(result).to.be.false;
    });

    it('should return false when user is an authorized agent', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(true);

      const formData = {
        'view:loginState': {
          isLoggedIn: false,
        },
      };

      const result = isNotLoggedInVeteran(formData);
      expect(result).to.be.false;
    });

    it('should return true when view:loginState is missing but user is veteran', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const result = isNotLoggedInVeteran({});
      expect(result).to.be.true;
    });

    it('should return false when formData is null', () => {
      sandbox.stub(helpers, 'isVeteran').returns(false);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const result = isNotLoggedInVeteran(null);
      expect(result).to.be.false;
    });
  });

  describe('isLoggedInVeteranPreparer', () => {
    it('should return true when user is logged in veteran and authorized agent', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(true);

      const formData = {
        'view:loginState': {
          isLoggedIn: true,
        },
      };

      const result = isLoggedInVeteranPreparer(formData);
      expect(result).to.be.true;
    });

    it('should return false when user is not an authorized agent', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const formData = {
        'view:loginState': {
          isLoggedIn: true,
        },
      };

      const result = isLoggedInVeteranPreparer(formData);
      expect(result).to.be.false;
    });

    it('should return false when user is not logged in', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(true);

      const formData = {
        'view:loginState': {
          isLoggedIn: false,
        },
      };

      const result = isLoggedInVeteranPreparer(formData);
      expect(result).to.be.false;
    });

    it('should return false when user is not a veteran', () => {
      sandbox.stub(helpers, 'isVeteran').returns(false);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(true);

      const formData = {
        'view:loginState': {
          isLoggedIn: true,
        },
      };

      const result = isLoggedInVeteranPreparer(formData);
      expect(result).to.be.false;
    });

    it('should return false when view:loginState is missing', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(true);

      const result = isLoggedInVeteranPreparer({});
      expect(result).to.be.false;
    });
  });

  describe('isNotLoggedInVeteranPreparer', () => {
    it('should return true when user is veteran, authorized agent, and not logged in', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(true);

      const formData = {
        'view:loginState': {
          isLoggedIn: false,
        },
      };

      const result = isNotLoggedInVeteranPreparer(formData);
      expect(result).to.be.true;
    });

    it('should return false when user is logged in', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(true);

      const formData = {
        'view:loginState': {
          isLoggedIn: true,
        },
      };

      const result = isNotLoggedInVeteranPreparer(formData);
      expect(result).to.be.false;
    });

    it('should return false when user is not an authorized agent', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(false);

      const formData = {
        'view:loginState': {
          isLoggedIn: false,
        },
      };

      const result = isNotLoggedInVeteranPreparer(formData);
      expect(result).to.be.false;
    });

    it('should return false when user is not a veteran', () => {
      sandbox.stub(helpers, 'isVeteran').returns(false);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(true);

      const formData = {
        'view:loginState': {
          isLoggedIn: false,
        },
      };

      const result = isNotLoggedInVeteranPreparer(formData);
      expect(result).to.be.false;
    });

    it('should return true when view:loginState is missing and user is veteran and agent', () => {
      sandbox.stub(helpers, 'isVeteran').returns(true);
      sandbox.stub(helpers, 'isAuthorizedAgent').returns(true);

      const result = isNotLoggedInVeteranPreparer({});
      expect(result).to.be.true;
    });
  });

  describe('createOpenRemoveModal', () => {
    it('should return a function that sets remove index and shows modal', () => {
      const setRemoveIndex = sinon.spy();
      const setShowRemoveModal = sinon.spy();
      const index = 3;

      const openRemoveModal = createOpenRemoveModal(
        setRemoveIndex,
        setShowRemoveModal,
      );

      expect(typeof openRemoveModal).to.equal('function');

      openRemoveModal(index);

      expect(setRemoveIndex.calledOnce).to.be.true;
      expect(setRemoveIndex.calledWith(index)).to.be.true;
      expect(setShowRemoveModal.calledOnce).to.be.true;
      expect(setShowRemoveModal.calledWith(true)).to.be.true;
    });

    it('should handle multiple calls with different indices', () => {
      const setRemoveIndex = sinon.spy();
      const setShowRemoveModal = sinon.spy();

      const openRemoveModal = createOpenRemoveModal(
        setRemoveIndex,
        setShowRemoveModal,
      );

      openRemoveModal(1);
      openRemoveModal(5);

      expect(setRemoveIndex.calledTwice).to.be.true;
      expect(setRemoveIndex.firstCall.calledWith(1)).to.be.true;
      expect(setRemoveIndex.secondCall.calledWith(5)).to.be.true;
      expect(setShowRemoveModal.calledTwice).to.be.true;
      expect(setShowRemoveModal.alwaysCalledWith(true)).to.be.true;
    });
  });

  describe('createCloseRemoveModal', () => {
    let setRemoveIndex;
    let setShowRemoveModal;
    let removeFile;
    let getFileListId;

    beforeEach(() => {
      setRemoveIndex = sinon.spy();
      setShowRemoveModal = sinon.spy();
      removeFile = sinon.spy();
      getFileListId = sinon.stub().returns('file-list-id');
    });

    it('should return a function that closes modal without removing file by default', () => {
      const removeIndex = 2;
      const closeRemoveModal = createCloseRemoveModal(
        removeIndex,
        setRemoveIndex,
        setShowRemoveModal,
        removeFile,
        getFileListId,
      );

      expect(typeof closeRemoveModal).to.equal('function');

      closeRemoveModal();

      expect(setRemoveIndex.calledOnce).to.be.true;
      expect(setRemoveIndex.calledWith(null)).to.be.true;
      expect(setShowRemoveModal.calledOnce).to.be.true;
      expect(setShowRemoveModal.calledWith(false)).to.be.true;
      expect(removeFile.called).to.be.false;
    });

    it('should remove file when remove option is true', () => {
      const removeIndex = 3;
      const closeRemoveModal = createCloseRemoveModal(
        removeIndex,
        setRemoveIndex,
        setShowRemoveModal,
        removeFile,
        getFileListId,
      );

      closeRemoveModal({ remove: true });

      expect(setRemoveIndex.calledOnce).to.be.true;
      expect(setRemoveIndex.calledWith(null)).to.be.true;
      expect(setShowRemoveModal.calledOnce).to.be.true;
      expect(setShowRemoveModal.calledWith(false)).to.be.true;
      expect(removeFile.calledOnce).to.be.true;
      expect(removeFile.calledWith(removeIndex)).to.be.true;
    });

    it('should focus element when remove is false', () => {
      const removeIndex = 1;
      const closeRemoveModal = createCloseRemoveModal(
        removeIndex,
        setRemoveIndex,
        setShowRemoveModal,
        removeFile,
        getFileListId,
      );

      closeRemoveModal({ remove: false });

      expect(removeFile.called).to.be.false;
      expect(setRemoveIndex.calledOnce).to.be.true;
      expect(setRemoveIndex.calledWith(null)).to.be.true;
      expect(setShowRemoveModal.calledOnce).to.be.true;
      expect(setShowRemoveModal.calledWith(false)).to.be.true;
    });

    it('should handle empty options object', () => {
      const removeIndex = 0;
      const closeRemoveModal = createCloseRemoveModal(
        removeIndex,
        setRemoveIndex,
        setShowRemoveModal,
        removeFile,
        getFileListId,
      );

      closeRemoveModal({});

      expect(setRemoveIndex.calledOnce).to.be.true;
      expect(setShowRemoveModal.calledOnce).to.be.true;
      expect(removeFile.called).to.be.false;
    });

    it('should throw error when null options is passed', () => {
      const removeIndex = 4;
      const closeRemoveModal = createCloseRemoveModal(
        removeIndex,
        setRemoveIndex,
        setShowRemoveModal,
        removeFile,
        getFileListId,
      );

      expect(() => closeRemoveModal(null)).to.throw();
    });
  });

  describe('createCancelUpload', () => {
    it('should return a function that aborts upload request and removes file', () => {
      const uploadRequest = {
        abort: sinon.spy(),
      };
      const removeFile = sinon.spy();
      const index = 2;

      const cancelUpload = createCancelUpload(uploadRequest, removeFile);

      expect(typeof cancelUpload).to.equal('function');

      cancelUpload(index);

      expect(uploadRequest.abort.calledOnce).to.be.true;
      expect(removeFile.calledOnce).to.be.true;
      expect(removeFile.calledWith(index)).to.be.true;
    });

    it('should handle null upload request', () => {
      const removeFile = sinon.spy();
      const index = 1;

      const cancelUpload = createCancelUpload(null, removeFile);

      cancelUpload(index);

      expect(removeFile.calledOnce).to.be.true;
      expect(removeFile.calledWith(index)).to.be.true;
    });

    it('should handle undefined upload request', () => {
      const removeFile = sinon.spy();
      const index = 0;

      const cancelUpload = createCancelUpload(undefined, removeFile);

      cancelUpload(index);

      expect(removeFile.calledOnce).to.be.true;
      expect(removeFile.calledWith(index)).to.be.true;
    });

    it('should handle multiple calls with different indices', () => {
      const uploadRequest = {
        abort: sinon.spy(),
      };
      const removeFile = sinon.spy();

      const cancelUpload = createCancelUpload(uploadRequest, removeFile);

      cancelUpload(3);
      cancelUpload(7);

      expect(uploadRequest.abort.calledTwice).to.be.true;
      expect(removeFile.calledTwice).to.be.true;
      expect(removeFile.firstCall.calledWith(3)).to.be.true;
      expect(removeFile.secondCall.calledWith(7)).to.be.true;
    });
  });
});
