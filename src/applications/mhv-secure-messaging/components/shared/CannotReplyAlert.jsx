import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Alerts, Paths } from '../../util/constants';

const CannotReplyAlert = props => {
  const { visible, isOhMessage = false } = props;
  return (
    <>
      {visible && (
        <VaAlert status="info" class="vads-u-margin-y--4">
          <h2 slot="headline" data-testid="expired-alert-message">
            {Alerts.Message.CANNOT_REPLY_INFO_HEADER}
          </h2>
          {!isOhMessage ? (
            <p>
              {`${Alerts.Message.CANNOT_REPLY_BODY.MAIN} ${
                Alerts.Message.CANNOT_REPLY_BODY.VISTA
              }`}
            </p>
          ) : (
            <>
              <p>{Alerts.Message.CANNOT_REPLY_BODY.MAIN}</p>
              <p>{Alerts.Message.CANNOT_REPLY_BODY.OH}</p>
              <p>
                <a
                  href="/find-locations"
                  target="_blank"
                  data-dd-action-name="cannot-reply-find-facility"
                >
                  Find your VA health facility
                </a>
              </p>
              <p>{Alerts.Message.CANNOT_REPLY_BODY.OH_CONTACT}</p>
            </>
          )}
          <p className="vads-u-margin-top--neg1 vads-u-margin-bottom--1 vads-u-font-weight--bold">
            <Link
              className="alertbox-link vads-c-action-link--green"
              aria-label="Start a new message"
              to={Paths.COMPOSE}
              data-dd-action-name="Start a new message - 45 day alert"
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
  isOhMessage: PropTypes.bool,
  visible: PropTypes.bool,
};

export default CannotReplyAlert;
