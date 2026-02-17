import { useEffect, useMemo } from 'react';
import { ErrorMessages } from '../util/constants';

/**
 * Determines the appropriate navigation error type based on form state.
 *
 * @param {Object} params - Form state parameters
 * @param {string} params.messageBody - Current message body
 * @param {string} params.subject - Current subject
 * @param {string|number|null} params.selectedRecipientId - Selected recipient ID
 * @param {string|null} params.category - Selected category
 * @param {Array} params.attachments - List of attachments
 * @param {Object|null} params.draft - Existing draft object
 * @param {boolean} params.savedDraft - Whether draft has been saved
 * @param {boolean} params.isSignatureRequired - Whether signature is required
 * @returns {string|null} Navigation error type constant or null
 */
export const calculateNavigationErrorType = ({
  messageBody,
  subject,
  selectedRecipientId,
  category,
  attachments,
  draft,
  savedDraft,
  isSignatureRequired,
}) => {
  const isBlankForm =
    messageBody === '' &&
    subject === '' &&
    Number(selectedRecipientId) === 0 &&
    category === null &&
    attachments.length === 0;

  const isEditedSaved =
    messageBody === draft?.body &&
    Number(selectedRecipientId) === draft?.recipientId &&
    category === draft?.category &&
    subject === draft?.subject;

  const isEditedForm =
    (messageBody !== draft?.body ||
      Number(selectedRecipientId) !== Number(draft?.recipientId) ||
      category !== draft?.category ||
      subject !== draft?.subject) &&
    !isBlankForm &&
    !isEditedSaved;

  const isFormFilled =
    messageBody !== '' &&
    subject !== '' &&
    Number(selectedRecipientId) !== 0 &&
    category !== null;

  const unsavedFilledDraft = isFormFilled && !isEditedSaved && !savedDraft;

  const partiallySavedDraftWithSignRequired =
    !draft && unsavedFilledDraft && !attachments.length && isSignatureRequired;

  const partiallySavedDraft =
    (!isFormFilled && (!isBlankForm || attachments.length > 0)) ||
    partiallySavedDraftWithSignRequired;

  const savedDraftWithEdits =
    (savedDraft && !isEditedSaved && isEditedForm) ||
    (!!draft && unsavedFilledDraft);

  const savedDraftWithNoEdits =
    (savedDraft && !isEditedForm) || (!!draft && !isEditedForm);

  if (isBlankForm) {
    return null;
  }
  if (partiallySavedDraft) {
    return ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR;
  }
  if (
    attachments.length > 0 &&
    (unsavedFilledDraft ||
      savedDraftWithEdits ||
      savedDraftWithNoEdits ||
      partiallySavedDraft)
  ) {
    return ErrorMessages.Navigation.UNABLE_TO_SAVE_DRAFT_ATTACHMENT_ERROR;
  }
  if (
    !draft &&
    unsavedFilledDraft &&
    !attachments.length &&
    !isSignatureRequired
  ) {
    return ErrorMessages.Navigation.CONT_SAVING_DRAFT_ERROR;
  }
  if (!isSignatureRequired && savedDraftWithEdits && !attachments.length) {
    return ErrorMessages.Navigation.CONT_SAVING_DRAFT_CHANGES_ERROR;
  }
  if (isSignatureRequired && savedDraftWithEdits && !attachments.length) {
    return ErrorMessages.Navigation.UNABLE_TO_SAVE_DRAFT_SIGNATURE_ERROR;
  }

  return null;
};

/**
 * Custom hook to manage navigation error state for compose form.
 * Calculates and sets the appropriate navigation error based on form state.
 *
 * @param {Object} params - Hook parameters
 * @param {string} params.messageBody - Current message body
 * @param {string} params.subject - Current subject
 * @param {string|number|null} params.selectedRecipientId - Selected recipient ID
 * @param {string|null} params.category - Selected category
 * @param {Array} params.attachments - List of attachments
 * @param {Object|null} params.draft - Existing draft object
 * @param {boolean} params.savedDraft - Whether draft has been saved
 * @param {boolean} params.isSignatureRequired - Whether signature is required
 * @param {Function} params.setUnsavedNavigationError - Callback to set navigation error
 */
const useNavigationError = ({
  messageBody,
  subject,
  selectedRecipientId,
  category,
  attachments,
  draft,
  savedDraft,
  isSignatureRequired,
  setUnsavedNavigationError,
}) => {
  // Memoize the error type calculation to prevent unnecessary recalculations
  const navigationErrorType = useMemo(
    () =>
      calculateNavigationErrorType({
        messageBody,
        subject,
        selectedRecipientId,
        category,
        attachments,
        draft,
        savedDraft,
        isSignatureRequired,
      }),
    [
      messageBody,
      subject,
      selectedRecipientId,
      category,
      attachments,
      draft,
      savedDraft,
      isSignatureRequired,
    ],
  );

  // Only trigger side effect when the calculated error type changes
  useEffect(() => {
    setUnsavedNavigationError(navigationErrorType);
  }, [navigationErrorType, setUnsavedNavigationError]);
};

export default useNavigationError;
