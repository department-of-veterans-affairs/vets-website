/** TODO
 * This component requires a further decision on how to handle the alertList.
 * Currently, we are displaying the most recent alert marked as active.
 * We may want to display all active alerts, or only the most recent alert.
 * Multiple alerts are not currently supported.
 * They can be displayed as a list in one alert box, or as multiple alert boxes.
 */

/**
 * Accessibility: The sr-only span delays its content (srAlertContent) until
 * page focus settles.  Each focusin event resets a 1s debounce timer so
 * VoiceOver finishes reading whatever element received focus before the
 * polite aria-live announcement queues.  A 5s hard ceiling guarantees the
 * announcement fires even if focus keeps moving.
 * handleAlertFocus is restricted to error alerts only — for success/info
 * alerts the 500ms focus-steal interrupts VoiceOver mid-announcement.
 */

import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import useInterval from '../../hooks/use-interval';
import { Alerts, DefaultFolders, Errors, Paths } from '../../util/constants';
import { closeAlert, focusOutAlert } from '../../actions/alerts';
import { retrieveFolder } from '../../actions/folders';
import RouterLink from './RouterLink';

const AlertBackgroundBox = props => {
  const { setShowAlertBackgroundBox = () => {} } = props;
  const dispatch = useDispatch();
  const alertList = useSelector(state => state.sm.alerts?.alertList);
  const folder = useSelector(state => state.sm.folders?.folder);
  const [alertContent, setAlertContent] = useState('');
  const [srAlertContent, setSrAlertContent] = useState('');
  const alertRef = useRef();
  const timerSourceRef = useRef(null);
  const [activeAlert, setActiveAlert] = useState(null);

  // Check if user entered compose flow from sent folder (via sessionStorage)
  // or if they accessed a thread from the sent folder (via threadFolderId in Redux)
  // Use a ref to persist the threadFolderId value across re-renders since it may get
  // cleared when thread details are reset after sending a message
  const threadFolderId = useSelector(
    state => state.sm?.threadDetails?.threadFolderId,
  );
  const threadFolderIdRef = useRef(null);

  // Update ref synchronously during render - only when we have a valid value
  if (threadFolderId !== undefined && threadFolderId !== null) {
    threadFolderIdRef.current = threadFolderId;
  }

  const enteredFromSent =
    sessionStorage.getItem('sm_composeEntryUrl') === Paths.SENT ||
    Number(threadFolderIdRef.current) === DefaultFolders.SENT.id;
  const threadMessages = useSelector(
    state => state.sm?.threadDetails?.messages,
  );

  const {
    Message: { SERVER_ERROR_503 },
  } = Alerts;

  const {
    Code: { SERVICE_OUTAGE },
  } = Errors;

  const location = useLocation();

  // these props check if the current page is the folder view page or thread view page

  const {
    startNewMessagePage,
    foldersViewPage,
    threadViewPage,
    replyViewPage,
    contactListPage,
  } = useMemo(
    () => {
      return {
        startNewMessagePage: /new-message|draft/.test(location.pathname),
        foldersViewPage: /folders\/\d+/.test(location.pathname),
        threadViewPage: /thread\/\d+/.test(location.pathname),
        replyViewPage: /reply\/\d+/.test(location.pathname),
        contactListPage: /contact-list/.test(location.pathname),
      };
    },
    [location.pathname],
  );

  useEffect(
    () => {
      if (alertList?.length) {
        if (foldersViewPage && !folder?.name) return;
        if (
          (threadViewPage || replyViewPage) &&
          (threadMessages === undefined || threadMessages?.length < 1)
        )
          return;

        const filteredSortedAlerts = alertList
          .filter(alert => alert?.isActive)
          .sort((a, b) => {
            // Sort chronologically descending.
            return b.datestamp - a.datestamp;
          });

        // The activeAlert is the most recent alert marked as active.
        setActiveAlert(filteredSortedAlerts[0] || null);
        if (filteredSortedAlerts[0]) setShowAlertBackgroundBox(true);
      }
    },
    [
      alertList,
      folder,
      foldersViewPage,
      replyViewPage,
      setShowAlertBackgroundBox,
      threadMessages,
      threadViewPage,
    ],
  );

  const handleShowIcon = () => {
    if (props.noIcon) {
      return 'false';
    }
    return 'true';
  };
  const closeAlertBox = () => {
    dispatch(closeAlert());
    dispatch(focusOutAlert());
    setShowAlertBackgroundBox(false);
    // Per MHV accessibility decision records: move focus back to H1 after dismissing alert.
    // focusElement handles null gracefully if no H1 exists on the page.
    setTimeout(() => {
      focusElement(document.querySelector('h1'));
    }, 100);
  };

  // sets custom server error messages for the landing page and folder view pages
  useEffect(
    () => {
      const isServiceOutage = activeAlert?.response?.code === SERVICE_OUTAGE;
      const isErrorAlert = activeAlert?.alertType === 'error';
      let content = activeAlert?.content;

      if (
        !startNewMessagePage &&
        !foldersViewPage &&
        !threadViewPage &&
        !contactListPage &&
        (isServiceOutage || isErrorAlert)
      ) {
        content = SERVER_ERROR_503;
      }
      setAlertContent(content ?? '');
    },
    [
      SERVER_ERROR_503,
      SERVICE_OUTAGE,
      activeAlert,
      contactListPage,
      foldersViewPage,
      startNewMessagePage,
      threadViewPage,
    ],
  );

  // Wait for page focus to settle, then populate the sr-only span.
  // Each focusin event resets a 1s debounce timer so VoiceOver finishes
  // reading whatever element received focus before the polite announcement
  // queues.  A 5s hard ceiling guarantees the announcement fires even if
  // focus keeps moving.  Force a real text mutation (clear → RAF set) so
  // the live region fires reliably.  timerSourceRef prevents duplicates.
  useLayoutEffect(
    () => {
      if (!alertContent) {
        setSrAlertContent('');
        timerSourceRef.current = null;
        return undefined;
      }

      let debounceTimer;
      let rafId;
      timerSourceRef.current = null;

      const scheduleAnnounce = source => {
        timerSourceRef.current = source;
        // Force a real DOM text mutation: clear, then set on next frame
        setSrAlertContent('');
        rafId = requestAnimationFrame(() => {
          setSrAlertContent(alertContent);
        });
      };

      const onFocusIn = () => {
        if (timerSourceRef.current) return;
        // Reset the 1s debounce on every focus change
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(
          () => scheduleAnnounce('focus-settle'),
          1000,
        );
      };

      document.addEventListener('focusin', onFocusIn);

      // Kick off the initial debounce in case focus already settled
      onFocusIn();

      // Hard ceiling: announce after 5s no matter what
      const ceilingTimer = setTimeout(() => {
        if (!timerSourceRef.current) {
          scheduleAnnounce('ceiling');
        }
      }, 5000);

      return () => {
        clearTimeout(debounceTimer);
        clearTimeout(ceilingTimer);
        cancelAnimationFrame(rafId);
        document.removeEventListener('focusin', onFocusIn);
      };
    },
    [alertContent],
  );

  useInterval(() => {
    const shouldRetrieveFolders =
      activeAlert?.response?.code === SERVICE_OUTAGE ||
      folder?.folderId === undefined;

    if (shouldRetrieveFolders) {
      dispatch(retrieveFolder(folder?.folderId));
      dispatch(closeAlert());
    }
  }, 60000); // 1 minute

  const handleAlertFocus = useCallback(
    () => {
      // Only steal focus for error alerts — for success/info alerts the
      // focus-steal at 500ms interrupts VoiceOver mid-announcement.
      if (activeAlert?.alertType !== 'error') return;

      setTimeout(() => {
        focusElement(
          props.focus
            ? alertRef.current.shadowRoot.querySelector('button')
            : alertRef.current,
        );
      }, 500);
    },
    [activeAlert?.alertType, props.focus],
  );

  return (
    activeAlert &&
    activeAlert.header !== Alerts.Headers.HIDE_ALERT && (
      <VaAlert
        uswds
        ref={alertRef}
        background-only
        closeable={props.closeable}
        className={`${props.className || 'vads-u-margin-bottom--1'} va-alert`}
        close-btn-aria-label="Close notification"
        disable-analytics="false"
        full-width="false"
        show-icon={handleShowIcon()}
        status={activeAlert.alertType}
        onCloseEvent={
          closeAlertBox // success, error, warning, info, continue
        }
        onVa-component-did-load={handleAlertFocus}
      >
        <p
          className={
            enteredFromSent
              ? 'vads-u-margin-y--0'
              : 'vads-u-font-size--base vads-u-font-weight--bold vads-u-margin-y--0'
          }
          data-testid="alert-text"
        >
          {alertContent}
        </p>
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {srAlertContent}
        </span>
        {alertContent === Alerts.Message.SEND_MESSAGE_SUCCESS &&
          !enteredFromSent && (
            <RouterLink
              href={Paths.SENT}
              text="Review your sent messages"
              data-testid="review-sent-messages-link"
              data-dd-action-name="Sent messages link in success alert"
            />
          )}
      </VaAlert>
    )
  );
};

AlertBackgroundBox.propTypes = {
  activeAlert: PropTypes.object,
  className: PropTypes.string,
  closeable: PropTypes.bool,
  focus: PropTypes.bool,
  noIcon: PropTypes.bool,
  setShowAlertBackgroundBox: PropTypes.func,
};

export default AlertBackgroundBox;
