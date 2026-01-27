import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Alerts, Paths } from '../../util/constants';
import RouterLinkAction from './RouterLinkAction';

const CannotReplyAlert = props => {
  const { visible } = props;

  return (
    <>
      {visible && (
        <VaAlert status="warning" class="vads-u-margin-y--4">
          <h2 slot="headline" data-testid="cannot-reply-alert-message">
            {Alerts.Message.CANNOT_REPLY_INFO_HEADER}
          </h2>
          <p>{Alerts.Message.CANNOT_REPLY_BODY}</p>
          <p className="vads-u-margin-top--neg1 vads-u-margin-bottom--1 vads-u-font-weight--bold">
            <RouterLinkAction
              data-dd-action-name="Start a new message - 45 day alert"
              href={Paths.COMPOSE}
              text="Start a new message"
            />
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
