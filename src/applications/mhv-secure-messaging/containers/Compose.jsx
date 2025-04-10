import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { clearThread } from '../actions/threadDetails';
import { retrieveMessageThread } from '../actions/messages';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import InterstitialPage from './InterstitialPage';
import BlockedTriageGroupAlert from '../components/shared/BlockedTriageGroupAlert';
import { closeAlert } from '../actions/alerts';
import { PageTitles, Paths, BlockedTriageAlertStyles } from '../util/constants';
import { getPatientSignature } from '../actions/preferences';

const Compose = () => {
  const dispatch = useDispatch();
  const recipients = useSelector(state => state.sm.recipients);
  const { drafts, saveError } = useSelector(state => state.sm.threadDetails);
  const signature = useSelector(state => state.sm.preferences.signature);
  const { noAssociations } = useSelector(state => state.sm.recipients);
  const removeLandingPageFF = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingRemoveLandingPage
      ],
  );
  const draftMessage = drafts?.[0] ?? null;
  const { draftId } = useParams();
  const { allTriageGroupsBlocked } = recipients;

  const [acknowledged, setAcknowledged] = useState(false);
  const [draftType, setDraftType] = useState('');
  const [pageTitle, setPageTitle] = useState('Start a new message');
  const location = useLocation();
  const history = useHistory();
  const isDraftPage = location.pathname.includes('/draft');
  const header = useRef();

  useEffect(
    () => {
      if (location.pathname === Paths.COMPOSE) {
        dispatch(clearThread());
        setDraftType('compose');
      } else {
        dispatch(retrieveMessageThread(draftId));
      }

      const checkNextPath = history.listen(nextPath => {
        if (nextPath.pathname !== Paths.CONTACT_LIST) {
          dispatch(clearThread());
        }
      });
      return () => {
        checkNextPath();
      };
    },
    [dispatch, draftId, location.pathname],
  );

  useEffect(
    () => {
      if (!signature) {
        dispatch(getPatientSignature());
      }
    },
    [signature, dispatch],
  );

  useEffect(
    () => {
      if (draftMessage?.messageId && draftMessage.draftDate === null) {
        history.push(Paths.INBOX);
      }
      return () => {
        if (isDraftPage) {
          dispatch(closeAlert());
        }
      };
    },
    [isDraftPage, draftMessage, history, dispatch],
  );

  useEffect(
    () => {
      if (isDraftPage) {
        setPageTitle('Edit draft');
      }
    },
    [isDraftPage],
  );

  useEffect(
    () => {
      if (acknowledged && header) focusElement(document.querySelector('h1'));
      document.title = `${pageTitle} ${
        removeLandingPageFF
          ? PageTitles.NEW_MESSAGE_PAGE_TITLE_TAG
          : PageTitles.PAGE_TITLE_TAG
      }`;
    },
    [header, acknowledged, removeLandingPageFF, pageTitle],
  );

  const content = () => {
    if (!isDraftPage && recipients) {
      return (
        <>
          <ComposeForm
            pageTitle={pageTitle}
            headerRef={header}
            draft={draftMessage}
            recipients={!recipients.error && recipients}
            signature={signature}
          />
        </>
      );
    }

    if (saveError) {
      return (
        <va-alert status="error" visible class="vads-u-margin-y--9">
          <h2 slot="headline">We’re sorry. Something went wrong on our end</h2>
          <p>
            You can’t view your secure message because something went wrong on
            our end. Please check back soon.
          </p>
        </va-alert>
      );
    }

    return null;
  };

  return (
    <>
      {!draftType && (
        <VaLoadingIndicator
          message="Loading your secure message..."
          setFocus
          dataTestid="loading-indicator"
        />
      )}

      {draftType &&
        (noAssociations || allTriageGroupsBlocked) && (
          <div className="vads-l-grid-container compose-container">
            <h1>Start a new message</h1>
            <BlockedTriageGroupAlert
              alertStyle={
                allTriageGroupsBlocked
                  ? BlockedTriageAlertStyles.WARNING
                  : BlockedTriageAlertStyles.INFO
              }
            />
          </div>
        )}

      {draftType &&
      !acknowledged &&
      (noAssociations === (undefined || false) && !allTriageGroupsBlocked) ? (
        <InterstitialPage
          acknowledge={() => {
            setAcknowledged(true);
          }}
          type={draftType}
        />
      ) : (
        <>
          {draftType &&
            (noAssociations === (undefined || false) &&
              !allTriageGroupsBlocked) && (
              <div className="vads-l-grid-container compose-container">
                {content()}
              </div>
            )}
        </>
      )}
    </>
  );
};

export default Compose;
