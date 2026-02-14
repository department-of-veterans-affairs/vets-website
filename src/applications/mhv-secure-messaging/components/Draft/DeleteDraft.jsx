import React, { useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import PropType from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import DeleteDraftModal from '../Modals/DeleteDraftModal';
import {
  ALERT_TYPE_SUCCESS,
  Alerts,
  DefaultFolders,
  ErrorMessages,
  Paths,
} from '../../util/constants';
import {
  navigateToFolderByFolderId,
  setUnsavedNavigationError,
} from '../../util/helpers';
import { addAlert } from '../../actions/alerts';
import { deleteDraft } from '../../actions/draftDetails';
import * as Constants from '../../util/constants';

const _computeDraftDeleteRedirect = redirectPath => {
  // Parse the URL
  const [basePath, queryString] = redirectPath.split('?');
  if (!queryString) {
    // No query string, just add the param
    return `${redirectPath}?draftDeleteSuccess=true`;
  }

  // Split query params
  const params = queryString
    .split('&')
    .filter(param => !param.startsWith('rxRenewalMessageSuccess'));

  // Add the new param
  params.push('draftDeleteSuccess=true');

  // Reconstruct the URL
  return `${basePath}?${params.join('&')}`;
};

export { _computeDraftDeleteRedirect };

const DeleteDraft = props => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const deleteDraftButtonRef = useRef();
  const activeFolder = useSelector(state => state.sm.folders.folder);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    cannotReply,
    draftId,
    draftsCount = 1,
    draftBody,
    formPopulated,
    navigationError,
    refreshThreadCallback,
    setNavigationError,
    messageBody,
    draftSequence,
    setHideDraft,
    setIsEditing,
    savedComposeDraft,
    redirectPath,
  } = props;

  const showIcon = useState(!!cannotReply);

  // Navigation props
  const savedDraft = useMemo(() => draftId, [draftId]);

  const unsavedDraft = useMemo(() => draftId === undefined, [draftId]);

  const savedReplyDraft = useMemo(
    () => !!savedDraft && formPopulated === undefined,
    [savedDraft, formPopulated],
  );

  const blankReplyDraft = useMemo(
    () => draftBody === undefined && messageBody === '',
    [draftBody, messageBody],
  );

  const inProgressReplyDraft = useMemo(
    () => !blankReplyDraft && messageBody !== draftBody,
    [blankReplyDraft, messageBody, draftBody],
  );

  const editableDraft = useMemo(() => !!savedDraft && formPopulated === true, [
    savedDraft,
    formPopulated,
  ]);

  const newMessageNavErr = useMemo(
    () => unsavedDraft && navigationError !== null,
    [unsavedDraft, navigationError],
  );

  const unsavedNewDraftMsg = useMemo(
    () => draftId === undefined && navigationError === null,
    [draftId, navigationError],
  );

  const unsavedDeleteSuccessful = () =>
    dispatch(
      addAlert(ALERT_TYPE_SUCCESS, '', Alerts.Message.DELETE_DRAFT_SUCCESS),
    );

  const handleDeleteDraftConfirm = () => {
    setNavigationError(null);
    setIsModalVisible(false);

    const postDeleteAction = () => {
      if (draftsCount === 1) {
        dispatch(
          addAlert(
            Constants.ALERT_TYPE_SUCCESS,
            '',
            Constants.Alerts.Message.DELETE_DRAFT_SUCCESS,
          ),
        );
        const { pathname } = location;
        const defaultFolderId = activeFolder
          ? activeFolder.folderId
          : DefaultFolders.DRAFTS.id;

        if (redirectPath) {
          const finalPath = _computeDraftDeleteRedirect(redirectPath);
          window.location.replace(finalPath);
        } else if (pathname.includes('/new-message')) {
          navigateToFolderByFolderId(
            activeFolder ? activeFolder.folderId : DefaultFolders.DRAFTS.id,
            history,
          );
        } else if (pathname.includes(Paths.REPLY)) {
          history.goBack();
        } else if (pathname.includes(Paths.MESSAGE_THREAD + draftId)) {
          navigateToFolderByFolderId(defaultFolderId, history);
        } else if (pathname.includes(Paths.MESSAGE_THREAD)) {
          setIsEditing(false);
          setHideDraft(true);
        }
      } else {
        refreshThreadCallback();
      }
    };

    if (savedDraft) {
      dispatch(deleteDraft(draftId)).then(() => {
        postDeleteAction();
      });
    } else {
      postDeleteAction();
    }
  };

  const handleDeleteModalClose = () => {
    if (unsavedNewDraftMsg) {
      setUnsavedNavigationError(
        ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR,
        setNavigationError,
        ErrorMessages,
      );
    }
    setIsModalVisible(false);
    focusElement(deleteDraftButtonRef.current);
  };

  return (
    <>
      {/* TODO add GA event */}
      <button
        type="button"
        id={`delete-draft-button${draftSequence ? `-${draftSequence}` : ''}`}
        ref={deleteDraftButtonRef}
        className={`usa-button usa-button-secondary ${
          cannotReply ? 'vads-u-padding-x--4' : 'vads-u-flex--1'
        } delete-draft-button vads-u-margin-top--0 vads-u-margin-right--0 vads-u-margin-bottom--0 vads-u-padding-x--0p5 vads-u-display--flex vads-u-flex-direction--row vads-u-justify-content--center`}
        data-testid={`delete-draft-button${
          draftSequence ? `-${draftSequence}` : ''
        }`}
        data-dd-action-name={`Delete Draft Button${
          draftSequence ? `-${draftSequence}` : ''
        }`}
        onClick={() => {
          if (
            newMessageNavErr ||
            editableDraft ||
            savedReplyDraft ||
            inProgressReplyDraft ||
            savedComposeDraft
          ) {
            setIsModalVisible(true);
            setNavigationError(null);
          }
          if (blankReplyDraft || unsavedNewDraftMsg) {
            unsavedDeleteSuccessful();
            history.goBack();
          }
        }}
      >
        {showIcon && <va-icon icon="delete" aria-hidden="true" />}
        Delete draft {draftSequence && `${draftSequence}`}
      </button>
      <DeleteDraftModal
        draftSequence={draftSequence}
        visible={isModalVisible}
        onClose={handleDeleteModalClose}
        onDelete={handleDeleteDraftConfirm}
      />
    </>
  );
};

DeleteDraft.propTypes = {
  cannotReply: PropType.bool,
  draftBody: PropType.string,
  draftId: PropType.number,
  draftSequence: PropType.number,
  draftsCount: PropType.number,
  formPopulated: PropType.bool,
  isModalVisible: PropType.bool,
  messageBody: PropType.string,
  navigationError: PropType.object,
  redirectPath: PropType.string,
  refreshThreadCallback: PropType.func,
  savedComposeDraft: PropType.bool,
  setHideDraft: PropType.func,
  setIsEditing: PropType.func,
  setIsModalVisible: PropType.func,
  setNavigationError: PropType.func,
  setUnsavedNavigationError: PropType.func,
  showIcon: PropType.bool,
};

export default DeleteDraft;
