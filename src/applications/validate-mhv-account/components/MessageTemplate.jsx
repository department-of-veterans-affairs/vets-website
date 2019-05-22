import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const MessageTemplate = ({ content }) => (
  <div className="row">
    <div className="usa-content columns medium-9 vads-u-padding-bottom--5">
      <h1>{content.heading}</h1>
      {content.alertContent && (
        <AlertBox
          content={content.alertContent}
          isVisible
          status={content.alertStatus}
        />
      )}
      {content.body}
    </div>
  </div>
);

MessageTemplate.propTypes = {
  content: PropTypes.object.isRequired,
};

export default MessageTemplate;
