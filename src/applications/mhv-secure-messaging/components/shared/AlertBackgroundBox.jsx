/** TODO
 * This component requires a further decision on how to handle the alertList.
 * Currently, we are displaying the most recent alert marked as active.
 * We may want to display all active alerts, or only the most recent alert.
 * Multiple alerts are not currently supported.
 * They can be displayed as a list in one alert box, or as multiple alert boxes.
 */

/**
 * Added accessibility fix to ensure that the alert content and the current location are
 * announced to the user in a way that's accessible to screen readers.
 * This component uses @prop lastPathName to check if url location is on
 * the secure messages landing page so that if there's a service outage, a unique server
 * error message from api response content will be displayed only for that page.
 * Additionally, A11Y reccommends that the 503 error alert content should use an h1 tag
 * since in this case there are no other content on screen.
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import useInterval from '../../hooks/use-interval';
import { Alerts, Categories, Errors, Paths } from '../../util/constants';
import { closeAlert, focusOutAlert } from '../../actions/alerts';
import { retrieveFolder } from '../../actions/folders';
import { formatPathName } from '../../util/helpers';

const AlertBackgroundBox = props => {
  const dispatch = useDispatch();
  const alertList = useSelector(state => state.sm.alerts?.alertList);
  const folder = useSelector(state => state.sm.folders?.folder);
  const [alertHeader, setAlertHeader] = useState('');
  const [alertContent, setAlertContent] = useState('');
  const [closeableAlert, setCloseableAlert] = useState(true);
  const alertRef = useRef();
  const [activeAlert, setActiveAlert] = useState(null);
  const [alertAriaLabel, setAlertAriaLabel] = useState('');
  const threadMessages = useSelector(
    state => state.sm?.threadDetails?.messages,
  );

  const {
    Message: {
      SERVER_ERROR_503,
      SERVER_ERROR_500_MESSAGES_HEADING,
      SERVER_ERROR_500_MESSAGES_CONTENT,
    },
  } = Alerts;

  const {
    Code: { SERVICE_OUTAGE },
  } = Errors;

  const location = useLocation();
  const SrOnlyTag = alertContent === SERVER_ERROR_503 ? 'h1' : 'span';

  const lastPathName = formatPathName(location.pathname, 'Messages');

  // these props check if the current page is the folder view page or thread view page
  const foldersViewPage = /folders\/\d+/.test(location.pathname);
  const threadViewPage = /thread\/\d+/.test(location.pathname);
  const replyViewPage = /reply\/\d+/.test(location.pathname);
  const contactListPage = /contact-list/.test(location.pathname);

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

        let categoryText = '';

        if (threadViewPage || replyViewPage) {
          categoryText =
            threadMessages[0]?.category === 'OTHER'
              ? Categories.OTHER
              : threadMessages[0]?.category;
        }

        if (lastPathName === 'Folders') {
          setAlertAriaLabel('You are in the my folders page.');
        } else if (foldersViewPage) {
          setAlertAriaLabel(`You are in ${folder?.name}.`);
        } else if (threadViewPage) {
          setAlertAriaLabel(
            `You are in ${categoryText}: ${
              threadMessages[0]?.subject
            } message thread.`,
          );
        } else if (replyViewPage) {
          setAlertAriaLabel(
            `You are in ${categoryText}: ${
              threadMessages[0]?.subject
            } message reply.`,
          );
        } else {
          setAlertAriaLabel(`You are in ${lastPathName}.`);
        }

        // The activeAlert is the most recent alert marked as active.
        setActiveAlert(filteredSortedAlerts[0] || null);
      }
    },
    [
      alertList,
      folder,
      foldersViewPage,
      lastPathName,
      replyViewPage,
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
  };

  // sets custom server error messages for the landing page and folder view pages
  useEffect(
    () => {
      const isServiceOutage = activeAlert?.response?.code === SERVICE_OUTAGE;
      const isErrorAlert = activeAlert?.alertType === 'error';
      const { INBOX, SENT, MESSAGE_THREAD } = Paths;
      let content = activeAlert?.content;
      let header = activeAlert?.header;
      let { closeable } = props;

      const isGeneralAlert =
        lastPathName !== 'Messages' &&
        !foldersViewPage &&
        !threadViewPage &&
        !contactListPage &&
        (isServiceOutage || isErrorAlert);

      const isMessagesAlertWithHeader =
        (isServiceOutage || isErrorAlert) &&
        (location.pathname === INBOX ||
          location.pathname === SENT ||
          location.pathname === MESSAGE_THREAD ||
          foldersViewPage);

      const filteredSortedAlerts = alertList
        .filter(alert => alert?.isActive)
        .sort((a, b) => {
          // Sort chronologically descending.
          return b.datestamp - a.datestamp;
        });

      if (isMessagesAlertWithHeader) {
        header = SERVER_ERROR_500_MESSAGES_HEADING;
        content = SERVER_ERROR_500_MESSAGES_CONTENT;
        closeable = false; // removes closing alert option on thread-list view pages
      } else if (isGeneralAlert) {
        header = null;
        content = SERVER_ERROR_503;
        closeable = true; // always allow closing the alert on folder view pages
      }
      setAlertHeader(header);
      setAlertContent(content);
      setCloseableAlert(closeable);
      setActiveAlert(filteredSortedAlerts[0] || null);
    },
    [
      SERVER_ERROR_500_MESSAGES_CONTENT,
      SERVER_ERROR_500_MESSAGES_HEADING,
      SERVER_ERROR_503,
      SERVICE_OUTAGE,
      activeAlert,
      alertList,
      contactListPage,
      foldersViewPage,
      lastPathName,
      location.pathname,
      props,
      props.closeable,
      threadViewPage,
    ],
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
      setTimeout(() => {
        focusElement(
          props.focus
            ? alertRef.current.shadowRoot.querySelector('button')
            : alertRef.current,
        );
      }, 500);
    },
    [props.focus],
  );

  return (
    <>
      {activeAlert &&
        activeAlert.header !== Alerts.Headers.HIDE_ALERT && (
          <VaAlert
            uswds
            ref={alertRef}
            background-only
            closeable={closeableAlert}
            className="vads-u-margin-bottom--1 va-alert"
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
            {closeableAlert ? null : (
              <h1 data-testid="alert-heading">{alertHeader}</h1>
            )}
            <div>
              <p className="vads-u-margin-y--0" data-testid="alert-text">
                {alertContent}
                <SrOnlyTag
                  className="sr-only"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {alertAriaLabel}
                </SrOnlyTag>
              </p>
            </div>
          </VaAlert>
        )}
    </>
  );
};

AlertBackgroundBox.propTypes = {
  activeAlert: PropTypes.object,
  closeable: PropTypes.bool,
  focus: PropTypes.bool,
  noIcon: PropTypes.bool,
};

export default AlertBackgroundBox;
