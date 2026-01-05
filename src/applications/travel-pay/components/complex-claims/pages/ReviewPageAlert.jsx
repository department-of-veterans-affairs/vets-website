import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ReviewPageAlert = ({
  description,
  header,
  status,
  visible,
  onCloseEvent,
  alertRef,
}) => {
  return (
    <>
      <VaAlert
        ref={alertRef}
        data-testid="review-page-alert"
        close-btn-aria-label="Close notification"
        status={status}
        closeable
        visible={visible}
        onCloseEvent={onCloseEvent}
      >
        {header && <h2 slot="headline">{header}</h2>}
        {description && <p className="vads-u-margin-y--0">{description}</p>}
      </VaAlert>
    </>
  );
};

ReviewPageAlert.propTypes = {
  alertRef: PropTypes.object,
  description: PropTypes.string,
  header: PropTypes.string,
  status: PropTypes.string,
  visible: PropTypes.bool,
  onCloseEvent: PropTypes.func,
};

export default ReviewPageAlert;
