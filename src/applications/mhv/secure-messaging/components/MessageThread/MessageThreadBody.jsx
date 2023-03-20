import React from 'react';
import PropTypes from 'prop-types';
import { urlRegex, httpRegex } from '../../util/helpers';

const MessageThreadBody = props => {
  const { expanded, text } = props;
  const words = text?.split(/[^\S\r\n]+/g);

  return (
    <div
      className={
        expanded
          ? 'message-list-body-expanded vads-u-margin-bottom--2'
          : 'message-list-body-collapsed'
      }
    >
      <>
        <span className="vads-u-margin-y--0">
          {words?.map((word, i) => {
            return (word.match(urlRegex) || word.match(httpRegex)) &&
              words.length >= 1 ? (
              <a
                tabIndex={!expanded ? -1 : 0}
                key={i}
                href={word}
                target="_blank"
                rel="noreferrer"
              >
                {`${word} `}
              </a>
            ) : (
              `${word} `
            );
          })}
        </span>
      </>
    </div>
  );
};

MessageThreadBody.propTypes = {
  expanded: PropTypes.bool,
  text: PropTypes.string,
};

export default MessageThreadBody;
