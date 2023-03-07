import React from 'react';
import PropTypes from 'prop-types';
import { urlRegex, httpRegex } from '../../util/helpers';

const MessageThreadBody = props => {
  const words = props.text?.split(/[^\S\r\n]+/g);

  return (
    <div
      className={
        props.expanded
          ? 'message-list-body-expanded vads-u-margin-bottom--2'
          : 'message-list-body-collapsed'
      }
    >
      <>
        <span className="vads-u-margin-y--0">
          {words?.map(word => {
            return (word.match(urlRegex) || word.match(httpRegex)) &&
              words.length >= 1 ? (
              <a href={word} target="_blank" rel="noreferrer">{`${word} `}</a>
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
