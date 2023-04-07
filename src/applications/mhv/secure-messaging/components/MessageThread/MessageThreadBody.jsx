import React from 'react';
import PropTypes from 'prop-types';
import { urlRegex, httpRegex } from '../../util/helpers';

const MessageThreadBody = props => {
  const { text } = props;
  const words = text?.split(/[^\S\r\n]+/g);

  return (
    <div className="vads-u-padding-y--1 ">
      <>
        <span className="vads-u-margin-y--0">
          {words?.map((word, i) => {
            return (word.match(urlRegex) || word.match(httpRegex)) &&
              words.length >= 1 ? (
              <a key={i} href={word} target="_blank" rel="noreferrer">
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
