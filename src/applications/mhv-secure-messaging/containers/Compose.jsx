import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
// import {
//   selectCernerFacilities,
//   selectVistaFacilities,
// } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { clearThread } from '../actions/threadDetails';
import { retrieveMessageThread } from '../actions/messages';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import InterstitialPage from './InterstitialPage';
import BlockedTriageGroupAlert from '../components/shared/BlockedTriageGroupAlert';
import { closeAlert } from '../actions/alerts';
import { PageTitles, Paths, BlockedTriageAlertStyles } from '../util/constants';
import { getPatientSignature } from '../actions/preferences';
// import { setActiveFacility } from '../actions/recipients';

const Compose = () => {
  const isPilot = useSelector(state => state.sm.app.isPilot);
  const dispatch = useDispatch();
  const recipients = useSelector(state => state.sm.recipients);
  const { drafts, saveError } = useSelector(state => state.sm.threadDetails);
  const signature = useSelector(state => state.sm.preferences.signature);
  const { noAssociations } = useSelector(state => state.sm.recipients);
  const draftMessage = drafts?.[0] ?? null;
  const { draftId } = useParams();
  const { allTriageGroupsBlocked } = recipients;
  // const cernerFacilities = useSelector(selectCernerFacilities);
  // const vistaFacilities = useSelector(selectVistaFacilities);

  const [acknowledged, setAcknowledged] = useState(false);
  const [draftType, setDraftType] = useState('');
  const [pageTitle, setPageTitle] = useState(
    isPilot ? 'Start your message' : 'Start a new message',
  );
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

  // Follow this pattern to set the active facility once other components are connected.
  // The useEffect here should be removed and the dispatch added to the ChooseVAHealthcareSystem
  // component with the actual selected Facility passed into setActiveFacility
  //
  // useEffect(
  //   () => {
  //     if (
  //       isPilot &&
  //       recipients.allRecipients.length > 0 &&
  //       !recipients?.activeFacility
  //     ) {
  //       dispatch(
  //         // setActiveFacility(recipients?.allRecipients, cernerFacilities[0]),
  //         setActiveFacility(recipients?.allRecipients, vistaFacilities[0]),
  //       );
  //     }
  //   },
  //   [cernerFacilities, dispatch, isPilot, recipients, vistaFacilities],
  // );

  useEffect(
    () => {
      if (acknowledged && header) focusElement(document.querySelector('h1'));
      document.title = `${pageTitle} ${PageTitles.DEFAULT_PAGE_TITLE_TAG}`;
    },
    [header, acknowledged, pageTitle],
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
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
          data-testid="loading-indicator"
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
