import PropTypes from 'prop-types';
import React from 'react';
import Notification from '../../Notification';
import Type1UnknownUploadError from '../../Type1UnknownUploadError';
import { focusNotificationAlert } from '../../../utils/page';

export default function RequestNotifications({ message, type1UnknownErrors }) {
  return (
    <>
      {message && (
        <div className="vads-u-margin-y--4">
          <Notification
            title={message.title}
            body={message.body}
            type={message.type}
            onSetFocus={focusNotificationAlert}
          />
        </div>
      )}
      {type1UnknownErrors &&
        type1UnknownErrors.length > 0 && (
          <div className="vads-u-margin-y--4">
            <Notification
              title="We need you to submit files by mail or in person"
              body={<Type1UnknownUploadError errorFiles={type1UnknownErrors} />}
              role="alert"
              type="error"
              onSetFocus={!message ? focusNotificationAlert : undefined}
            />
          </div>
        )}
    </>
  );
}

RequestNotifications.propTypes = {
  message: PropTypes.object,
  type1UnknownErrors: PropTypes.array,
};
