import React from 'react';
import { Link } from 'react-router-dom';
import { Paths } from '../../util/constants';

const ComposeMessageButton = () => {
  return (
    <div className="vads-u-margin-top--1">
      <Link
        className="compose-message-link vads-c-action-link--green  vads-u-font-weight--bold"
        to={Paths.COMPOSE}
        data-testid="compose-message-link"
      >
        Start a new message
      </Link>
    </div>
  );
};

export default ComposeMessageButton;
