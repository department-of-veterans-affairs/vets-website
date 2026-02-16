import React from 'react';
import PropTypes from 'prop-types';
import {
  VaAlert,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Alerts, Paths } from '../../util/constants';
import RouterLinkAction from './RouterLinkAction';

const StaleMessageAlert = props => {
  const { visible, isOhMessage = false } = props;

  return (
    <>
      {visible && (
        <VaAlert status="info" class="vads-u-margin-y--4">
          <h2 slot="headline" data-testid="expired-alert-message">
            {Alerts.Message.STALE_REPLY_INFO_HEADER}
          </h2>
          {!isOhMessage ? (
            <p>
              {`${Alerts.Message.STALE_REPLY_BODY.MAIN} ${
                Alerts.Message.STALE_REPLY_BODY.VISTA
              }`}
            </p>
          ) : (
            <>
              <p>{Alerts.Message.STALE_REPLY_BODY.MAIN}</p>
              <p>{Alerts.Message.STALE_REPLY_BODY.OH}</p>
              <p>
                <VaLink
                  data-dd-action-name="cannot-reply-find-facility"
                  href="/find-locations"
                  text="Find your VA health facility"
                />
              </p>
              <p>{Alerts.Message.STALE_REPLY_BODY.OH_CONTACT}</p>
            </>
          )}
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

StaleMessageAlert.propTypes = {
  isOhMessage: PropTypes.bool,
  visible: PropTypes.bool,
};

export default StaleMessageAlert;
