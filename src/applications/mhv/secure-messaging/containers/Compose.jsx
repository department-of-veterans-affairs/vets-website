import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { retrieveMessage } from '../actions/messages';
import { getTriageTeams } from '../actions/triageTeams';
import BeforeMessageAddlInfo from '../components/BeforeMessageAddlInfo';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import EmergencyNote from '../components/EmergencyNote';

const Compose = () => {
  const dispatch = useDispatch();
  const { draftMessage, error } = useSelector(state => state.sm.draftDetails);
  const { triageTeams } = useSelector(state => state.sm.triageTeams);
  const { draftId } = useParams();
  const location = useLocation();
  const isDraftPage = location.pathname.includes('/draft');

  useEffect(
    () => {
      dispatch(getTriageTeams());
      if (isDraftPage && draftId) {
        dispatch(retrieveMessage(draftId, true));
      }
    },
    [isDraftPage, draftId],
  );

  let pageTitle;

  if (isDraftPage) {
    pageTitle = 'Edit draft';
  } else {
    pageTitle = 'Compose message';
  }

  const content = () => {
    if ((isDraftPage && !draftMessage) || !triageTeams) {
      return (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
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
    return <ComposeForm draft={draftMessage} recipients={triageTeams} />;
  };

  return (
    <div className="vads-l-grid-container compose-container">
      <h1 className="page-title">{pageTitle}</h1>
      <EmergencyNote />
      <div>
        <BeforeMessageAddlInfo />
      </div>

      {content()}
    </div>
  );
};

export default Compose;
