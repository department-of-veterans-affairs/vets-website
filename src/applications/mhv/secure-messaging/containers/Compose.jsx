import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { clearDraft } from '../actions/draftDetails';
import { retrieveMessageThread } from '../actions/messages';
import { getTriageTeams } from '../actions/triageTeams';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import EmergencyNote from '../components/EmergencyNote';
import AlertBox from '../components/shared/AlertBox';
import InterstitialPage from './InterstitialPage';
import { closeAlert } from '../actions/alerts';

const Compose = () => {
  const dispatch = useDispatch();
  const { draftMessage, error } = useSelector(state => state.sm.draftDetails);
  const { triageTeams } = useSelector(state => state.sm.triageTeams);
  const { draftId } = useParams();

  const [acknowledged, setAcknowledged] = useState(false);
  const [draftType, setDraftType] = useState('');
  const location = useLocation();
  const history = useHistory();
  const isDraftPage = location.pathname.includes('/draft');
  const header = useRef();

  useEffect(
    () => {
      dispatch(getTriageTeams());

      if (location.pathname === '/compose') {
        dispatch(clearDraft());
        setDraftType('compose');
      } else {
        dispatch(retrieveMessageThread(draftId));
      }
      return () => {
        dispatch(clearDraft());
      };
    },
    [dispatch, draftId, location.pathname],
  );

  useEffect(
    () => {
      if (draftMessage?.messageId && draftMessage.draftDate === null) {
        history.push('/inbox');
      }
      return () => {
        if (isDraftPage) {
          dispatch(closeAlert());
        }
      };
    },
    [isDraftPage, draftMessage, history, dispatch],
  );

  let pageTitle;

  if (isDraftPage) {
    pageTitle = 'Edit draft';
  } else {
    pageTitle = 'Start a new message';
  }

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  });

  const content = () => {
    if (!isDraftPage && triageTeams) {
      return (
        <>
          <h1 className="page-title" ref={header}>
            {pageTitle}
          </h1>
          <EmergencyNote dropDownFlag />
          <ComposeForm draft={draftMessage} recipients={triageTeams} />
        </>
      );
    }
    if ((isDraftPage && !draftMessage) || (!isDraftPage && !triageTeams)) {
      return (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
          data-testid="loading-indicator"
        />
      );
    }
    if (error) {
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
              <AlertBox />

              {content()}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Compose;
