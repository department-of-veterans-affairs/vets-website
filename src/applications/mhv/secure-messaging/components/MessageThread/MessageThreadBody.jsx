import React from 'react';
import PropTypes from 'prop-types';
import Linkify from 'react-linkify';

const MessageThreadBody = props => {
  const { text } = props;

  const componentDecorator = (href, linkText) => (
    <a href={href} target="_blank" rel="noreferrer">
      {`${linkText} (opens in new tab)`}
    </a>
  );

  return (
    <div className="vads-u-padding-y--1 ">
      <>
        <pre
          data-testid="message-body"
          className="vads-u-margin-y--0"
          data-dd-privacy="mask"
        >
          <Linkify componentDecorator={componentDecorator}>{text}</Linkify>
        </pre>
      </>
    </div>
  );
};

MessageThreadBody.propTypes = {
  expanded: PropTypes.bool,
  text: PropTypes.string,
};

export default MessageThreadBody;
