import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMessage, loadingComplete } from '../actions';
import { getTriageTeams } from '../actions/triageTeams';
import BeforeMessageAddlInfo from '../components/BeforeMessageAddlInfo';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import EmergencyNote from '../components/EmergencyNote';

const Compose = () => {
  const dispatch = useDispatch();
  const { isLoading, message, error } = useSelector(state => state.message);
  const { triageTeams } = useSelector(state => state.sm.triageTeams);
  const isDraft = window.location.pathname.includes('/draft');

  useEffect(
    () => {
      const messageId = window.location.pathname.split('/').pop();
      dispatch(getTriageTeams());
      if (isDraft) {
        dispatch(getMessage('draft', messageId));
      } else {
        dispatch(loadingComplete());
      }
    },
    [isDraft, dispatch],
  );

  let pageTitle;

  if (isDraft) {
    pageTitle = 'Edit draft';
  } else {
    pageTitle = 'Compose message';
  }

  const content = () => {
    if (isLoading || !triageTeams.length) {
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
    return <ComposeForm message={message} recipients={triageTeams} />;
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
