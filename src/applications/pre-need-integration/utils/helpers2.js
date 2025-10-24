import { focusElement } from 'platform/utilities/ui/focus';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { isAuthorizedAgent, isVeteran } from './helpers';

// Helper functions to check authentication status for veteran applicant details pages
export const isLoggedInVeteran = formData => {
  const isLoggedIn = formData?.['view:loginState']?.isLoggedIn || false;
  const isVet = isVeteran(formData);
  const isAgent = isAuthorizedAgent(formData);
  return !isAgent && isVet && isLoggedIn;
};

export const isNotLoggedInVeteran = formData => {
  const isLoggedIn = formData?.['view:loginState']?.isLoggedIn || false;
  const isVet = isVeteran(formData);
  const isAgent = isAuthorizedAgent(formData);
  return !isAgent && isVet && !isLoggedIn;
};

export const isLoggedInVeteranPreparer = formData => {
  const isLoggedIn = formData?.['view:loginState']?.isLoggedIn || false;
  const isVet = isVeteran(formData);
  const isAgent = isAuthorizedAgent(formData);
  return isAgent && isVet && isLoggedIn;
};

export const isNotLoggedInVeteranPreparer = formData => {
  const isLoggedIn = formData?.['view:loginState']?.isLoggedIn || false;
  const isVet = isVeteran(formData);
  const isAgent = isAuthorizedAgent(formData);
  return isAgent && isVet && !isLoggedIn;
};

// FileField helper functions
export const createOpenRemoveModal = (
  setRemoveIndex,
  setShowRemoveModal,
) => index => {
  setRemoveIndex(index);
  setShowRemoveModal(true);
};

export const createCloseRemoveModal = (
  removeIndex,
  setRemoveIndex,
  setShowRemoveModal,
  removeFile,
  getFileListId,
) => ({ remove = false } = {}) => {
  const idx = removeIndex;
  setRemoveIndex(null);
  setShowRemoveModal(false);
  if (remove) {
    removeFile(idx);
  } else {
    setTimeout(() => {
      focusElement(
        'button, .delete-upload',
        {},
        $(`#${getFileListId(idx)} .delete-upload`)?.shadowRoot,
      );
    });
  }
};

export const createCancelUpload = (uploadRequest, removeFile) => index => {
  if (uploadRequest) {
    uploadRequest.abort();
  }
  removeFile(index);
};
