import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Paths } from '../../util/constants';
import { clearDraftInProgress } from '../../actions/threadDetails';

const ComposeMessageButton = () => {
  const dispatch = useDispatch();
  return (
    <div className="vads-u-margin-top--1 vads-u-font-size--lg">
      <Link
        className="compose-message-link vads-c-action-link--green vads-u-font-weight--bold vads-u-padding-left--5"
        to={Paths.COMPOSE}
        data-testid="compose-message-link"
        onClick={() => dispatch(clearDraftInProgress())}
      >
        Start a new message
      </Link>
    </div>
  );
};

export default ComposeMessageButton;
