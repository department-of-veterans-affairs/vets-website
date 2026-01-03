import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Prompt, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearDraftInProgress,
  updateDraftInProgress,
} from '../../actions/threadDetails';
import { ErrorMessages, Paths } from '../../util/constants';
import useBeforeUnloadGuard from '../../hooks/useBeforeUnloadGuard';

export const RouteLeavingGuard = ({
  saveDraftHandler,
  type,
  persistDraftPaths = [],
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const navigate = useCallback(
    path => {
      history.push(path);
    },
    [history],
  );

  const [lastLocation, updateLastLocation] = useState();
  const [confirmedNavigation, updateConfirmedNavigation] = useState(false);
  const [modalVisible, updateModalVisible] = useState(false);
  const draftInProgress = useSelector(
    state => state.sm.threadDetails.draftInProgress,
  );
  const navigationError = draftInProgress?.navigationError;
  const saveError = draftInProgress?.saveError;
  const when = useMemo(() => !!navigationError || !!saveError, [
    navigationError,
    saveError,
  ]);
  const navigationErrorModalVisible =
    draftInProgress?.navigationErrorModalVisible;

  const savedDraft = draftInProgress?.savedDraft;
  const { title, p1, p2, confirmButtonText, cancelButtonText } = useMemo(
    () => (saveError && savedDraft ? saveError : navigationError) || {},
    [saveError, savedDraft, navigationError],
  );

  const confirmButtonDDActionName = useMemo(
    () =>
      saveError && savedDraft
        ? "Save draft without attachments button - Can't save with attachments modal"
        : 'Confirm Navigation Leaving Button',
    [saveError, savedDraft],
  );
  const cancelButtonDDActionName = useMemo(
    () =>
      saveError && savedDraft
        ? "Edit draft button - Can't save with attachments modal"
        : undefined,
    [saveError, savedDraft],
  );

  const setIsModalVisible = useCallback(
    val =>
      dispatch(updateDraftInProgress({ navigationErrorModalVisible: val })),
    [dispatch],
  );

  const setSavedDraft = useCallback(
    value => {
      dispatch(updateDraftInProgress({ savedDraft: value }));
    },
    [dispatch],
  );

  const showModal = useCallback(
    nextLocation => {
      setIsModalVisible(true);
      updateModalVisible(true);
      updateLastLocation(nextLocation);
    },
    [setIsModalVisible],
  );

  const closeModal = useCallback(
    () => {
      setIsModalVisible(false);
      updateModalVisible(false);
      setSavedDraft(false);
    },
    [setIsModalVisible, setSavedDraft],
  );

  const handleBlockedNavigation = useCallback(
    nextLocation => {
      let allowedPaths = [];
      if (type === 'compose') {
        allowedPaths = [
          `${Paths.RECENT_CARE_TEAMS}`,
          `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
          `${Paths.COMPOSE}${Paths.START_MESSAGE}`,
          `${Paths.MESSAGE_THREAD}${draftInProgress?.messageId}`,
        ];
      } else if (type === 'reply') {
        allowedPaths = [`${Paths.REPLY}`];
      }

      const currentPath = location.pathname;
      const nextPath = nextLocation.pathname;

      // Allow navigation between specified paths without guard
      const normalizePath = path => path.replace(/\/$/, '');
      const normalizedAllowedPaths = allowedPaths.map(normalizePath);
      const normalizedCurrentPath = normalizePath(currentPath);
      const normalizedNextPath = normalizePath(nextPath);

      if (
        normalizedAllowedPaths.includes(normalizedCurrentPath) &&
        normalizedAllowedPaths.includes(normalizedNextPath)
      ) {
        return true;
      }

      if (!confirmedNavigation && !!navigationError) {
        showModal(nextLocation);
        updateModalVisible(true);
        return false;
      }
      return true;
    },
    [
      type,
      location.pathname,
      confirmedNavigation,
      navigationError,
      draftInProgress?.messageId,
      showModal,
    ],
  );

  const handleConfirmNavigationClick = () => {
    const isConfirmButtonTextMatching = confirmButtonText.includes('Save');

    if (isConfirmButtonTextMatching) {
      saveDraftHandler('manual-confirmed');
    }
    closeModal();
    if (lastLocation) {
      updateConfirmedNavigation(true);
    }
  };

  const handleCancelNavigationClick = e => {
    setIsModalVisible(false);
    updateModalVisible(false);
    setSavedDraft(false);

    const isCancelButtonTextMatching =
      cancelButtonText ===
        ErrorMessages.ComposeForm.CONT_SAVING_DRAFT.cancelButtonText ||
      cancelButtonText ===
        ErrorMessages.ComposeForm.CONT_SAVING_DRAFT_CHANGES.cancelButtonText;

    if (isCancelButtonTextMatching) {
      saveDraftHandler('manual', e);
      updateConfirmedNavigation(true);
    }
  };

  useEffect(
    () => {
      if (confirmedNavigation && lastLocation?.pathname) {
        if (!persistDraftPaths.includes(lastLocation?.pathname)) {
          dispatch(clearDraftInProgress());
        }
        navigate(lastLocation.pathname);
        updateConfirmedNavigation(false);
      }
    },
    [
      confirmedNavigation,
      dispatch,
      lastLocation?.pathname,
      navigate,
      persistDraftPaths,
    ],
  );

  useEffect(
    () => {
      if (savedDraft && !!saveError) {
        updateModalVisible(true);
      }
    },
    [saveError, savedDraft],
  );

  useEffect(
    () => {
      if (!when && !!navigationErrorModalVisible) {
        closeModal();
      }
    },
    [when, navigationErrorModalVisible, closeModal],
  );

  useBeforeUnloadGuard(when);
  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <VaModal
        modalTitle={title}
        onCloseEvent={() => {
          closeModal();
          datadogRum.addAction('Navigation Warning Modal Closed');
        }}
        status="warning"
        visible={modalVisible}
        data-dd-action-name="Navigation Warning Modal"
        data-testid="navigation-warning-modal"
      >
        <p>
          {cancelButtonText !==
            ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
              .confirmButtonText && p1}
        </p>
        {p2 && <p>{p2}</p>}
        <div className="mobile-lg:vads-u-flex-direction--row">
          <va-button
            class="vads-u-margin-top--1 vads-u-flex--auto"
            text={cancelButtonText}
            onClick={handleCancelNavigationClick} // need to pass a func to save draft
            data-dd-action-name={cancelButtonDDActionName}
            data-testid="route-guard-primary-button"
          />
          <va-button
            class="vads-u-margin-top--1 vads-u-flex--auto"
            secondary
            text={confirmButtonText}
            onClick={handleConfirmNavigationClick}
            data-dd-action-name={confirmButtonDDActionName}
            data-testid="route-guard-secondary-button"
          />
        </div>
      </VaModal>
    </>
  );
};

RouteLeavingGuard.propTypes = {
  cancelButtonDDActionName: PropTypes.string,
  cancelButtonText: PropTypes.string,
  confirmButtonDDActionName: PropTypes.string,
  confirmButtonText: PropTypes.string,
  modalVisible: PropTypes.bool,
  navigate: PropTypes.func,
  p1: PropTypes.string,
  p2: PropTypes.any,
  persistDraftPaths: PropTypes.array,
  saveDraftHandler: PropTypes.func,
  saveError: PropTypes.object,
  savedDraft: PropTypes.bool,
  setIsModalVisible: PropTypes.func,
  setSetErrorModal: PropTypes.func,
  shouldBlockNavigation: PropTypes.func,
  title: PropTypes.string,
  type: PropTypes.oneOf(['compose', 'reply']),
  updateModalVisible: PropTypes.func,
  when: PropTypes.bool,
};

export default RouteLeavingGuard;
