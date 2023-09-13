import React from 'react';
import { Link } from 'react-router-dom';
import { Paths } from '../../util/constants';

const ComposeMessageButton = () => {
  return (
    <div className="vads-u-margin-top--0p5 vads-u-margin-bottom--2p5">
      <Link
        className="compose-message-link vads-u-font-weight--bold"
        to={Paths.COMPOSE}
        data-testid="compose-message-link"
      >
        <i className="fas fa-edit vads-u-margin-right--1" aria-hidden />
        Start a new message
      </Link>
    </div>
  );
};

export default ComposeMessageButton;
