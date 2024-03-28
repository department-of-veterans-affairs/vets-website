import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { clearThread } from '../actions/threadDetails';
import { retrieveMessageThread } from '../actions/messages';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import InterstitialPage from './InterstitialPage';
import { closeAlert } from '../actions/alerts';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { PageTitles, Paths } from '../util/constants';
import { getPatientSignature } from '../actions/preferences';

const Compose = () => {
  const dispatch = useDispatch();
  const { recipients } = useSelector(state => state.sm);
  const { drafts, saveError } = useSelector(state => state.sm.threadDetails);
  const signature = useSelector(state => state.sm.preferences.signature);
  const draftMessage = drafts?.length && drafts[0];
  const { draftId } = useParams();

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
      return () => {
        dispatch(clearThread());
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
      document.title = `${pageTitle} ${PageTitles.PAGE_TITLE_TAG}`;
    },
    [header, acknowledged],
  );

  const content = () => {
    if (!isDraftPage && recipients) {
      return (
        <>
          <h1 className="page-title vads-u-margin-top--0" ref={header}>
            {pageTitle}
          </h1>
          <ComposeForm
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

      {draftType && !acknowledged ? (
        <InterstitialPage
          acknowledge={() => {
            setAcknowledged(true);
          }}
          type={draftType}
        />
      ) : (
        <>
          {draftType && (
            <div className="vads-l-grid-container compose-container">
              <AlertBackgroundBox closeable />

              {content()}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Compose;
