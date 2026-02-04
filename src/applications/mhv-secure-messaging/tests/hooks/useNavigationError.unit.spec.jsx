import { expect } from 'chai';
import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useNavigationError, {
  calculateNavigationErrorType,
} from '../../hooks/useNavigationError';
import { ErrorMessages } from '../../util/constants';

describe('useNavigationError hook', () => {
  describe('calculateNavigationErrorType', () => {
    const baseFormState = {
      messageBody: '',
      subject: '',
      selectedRecipientId: 0,
      category: null,
      attachments: [],
      draft: null,
      savedDraft: false,
      isSignatureRequired: false,
    };

    it('returns null for a blank form', () => {
      const result = calculateNavigationErrorType(baseFormState);
      expect(result).to.be.null;
    });

    it('returns UNABLE_TO_SAVE_ERROR for partially filled form without attachments', () => {
      const result = calculateNavigationErrorType({
        ...baseFormState,
        messageBody: 'Hello',
        // Other fields still empty - partially filled
      });
      expect(result).to.equal(ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR);
    });

    it('returns UNABLE_TO_SAVE_ERROR for blank form with attachments', () => {
      const result = calculateNavigationErrorType({
        ...baseFormState,
        attachments: [{ name: 'test.pdf' }],
      });
      expect(result).to.equal(ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR);
    });

    it('returns UNABLE_TO_SAVE_DRAFT_ATTACHMENT_ERROR for filled form with attachments', () => {
      const result = calculateNavigationErrorType({
        ...baseFormState,
        messageBody: 'Hello',
        subject: 'Test Subject',
        selectedRecipientId: 123,
        category: 'OTHER',
        attachments: [{ name: 'test.pdf' }],
      });
      expect(result).to.equal(
        ErrorMessages.Navigation.UNABLE_TO_SAVE_DRAFT_ATTACHMENT_ERROR,
      );
    });

    it('returns CONT_SAVING_DRAFT_ERROR for new unsaved filled draft without signature required', () => {
      const result = calculateNavigationErrorType({
        ...baseFormState,
        messageBody: 'Hello',
        subject: 'Test Subject',
        selectedRecipientId: 123,
        category: 'OTHER',
        draft: null,
        savedDraft: false,
        isSignatureRequired: false,
      });
      expect(result).to.equal(ErrorMessages.Navigation.CONT_SAVING_DRAFT_ERROR);
    });

    it('returns CONT_SAVING_DRAFT_CHANGES_ERROR for saved draft with edits', () => {
      const draft = {
        body: 'Original body',
        subject: 'Original subject',
        recipientId: 123,
        category: 'OTHER',
      };
      const result = calculateNavigationErrorType({
        ...baseFormState,
        messageBody: 'Modified body',
        subject: 'Original subject',
        selectedRecipientId: 123,
        category: 'OTHER',
        draft,
        savedDraft: true,
        isSignatureRequired: false,
      });
      expect(result).to.equal(
        ErrorMessages.Navigation.CONT_SAVING_DRAFT_CHANGES_ERROR,
      );
    });

    it('returns UNABLE_TO_SAVE_DRAFT_SIGNATURE_ERROR for saved draft with edits when signature required', () => {
      const draft = {
        body: 'Original body',
        subject: 'Original subject',
        recipientId: 123,
        category: 'OTHER',
      };
      const result = calculateNavigationErrorType({
        ...baseFormState,
        messageBody: 'Modified body',
        subject: 'Original subject',
        selectedRecipientId: 123,
        category: 'OTHER',
        draft,
        savedDraft: true,
        isSignatureRequired: true,
      });
      expect(result).to.equal(
        ErrorMessages.Navigation.UNABLE_TO_SAVE_DRAFT_SIGNATURE_ERROR,
      );
    });

    it('returns null when form matches saved draft (no edits)', () => {
      const draft = {
        body: 'Hello',
        subject: 'Test Subject',
        recipientId: 123,
        category: 'OTHER',
      };
      const result = calculateNavigationErrorType({
        ...baseFormState,
        messageBody: 'Hello',
        subject: 'Test Subject',
        selectedRecipientId: 123,
        category: 'OTHER',
        draft,
        savedDraft: true,
      });
      expect(result).to.be.null;
    });

    it('returns UNABLE_TO_SAVE_ERROR for new filled draft with signature required', () => {
      const result = calculateNavigationErrorType({
        ...baseFormState,
        messageBody: 'Hello',
        subject: 'Test Subject',
        selectedRecipientId: 123,
        category: 'OTHER',
        draft: null,
        savedDraft: false,
        isSignatureRequired: true,
      });
      expect(result).to.equal(ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR);
    });
  });

  describe('useNavigationError hook integration', () => {
    it('calls setUnsavedNavigationError with correct error type', () => {
      const setUnsavedNavigationError = sinon.spy();

      renderHook(() =>
        useNavigationError({
          messageBody: 'Hello',
          subject: '',
          selectedRecipientId: 0,
          category: null,
          attachments: [],
          draft: null,
          savedDraft: false,
          isSignatureRequired: false,
          setUnsavedNavigationError,
        }),
      );

      expect(setUnsavedNavigationError.calledOnce).to.be.true;
      expect(setUnsavedNavigationError.firstCall.args[0]).to.equal(
        ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR,
      );
    });

    it('calls setUnsavedNavigationError with null for blank form', () => {
      const setUnsavedNavigationError = sinon.spy();

      renderHook(() =>
        useNavigationError({
          messageBody: '',
          subject: '',
          selectedRecipientId: 0,
          category: null,
          attachments: [],
          draft: null,
          savedDraft: false,
          isSignatureRequired: false,
          setUnsavedNavigationError,
        }),
      );

      expect(setUnsavedNavigationError.calledOnce).to.be.true;
      expect(setUnsavedNavigationError.firstCall.args[0]).to.be.null;
    });
  });
});
