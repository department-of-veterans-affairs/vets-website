import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Alerts, Paths } from '../../util/constants';

const CannotReplyAlert = props => {
  const { visible } = props;
  return (
    <>
      {visible && (
        <VaAlert status="info" class="vads-u-margin-y--4">
          <h2 slot="headline" data-testid="expired-alert-message">
            {Alerts.Message.CANNOT_REPLY_INFO_HEADER}
          </h2>
          <p>{Alerts.Message.CANNOT_REPLY_BODY}</p>
          <p className="vads-u-margin-top--neg1 vads-u-margin-bottom--1 vads-u-font-weight--bold">
            <Link
              className="alertbox-link vads-c-action-link--green"
              aria-label="Start a new message"
              to={Paths.COMPOSE}
            >
              Start a new message
            </Link>
          </p>
        </VaAlert>
      )}
    </>
  );
};

CannotReplyAlert.propTypes = {
  visible: PropTypes.bool,
};

export default CannotReplyAlert;
