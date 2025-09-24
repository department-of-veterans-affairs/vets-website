import React from 'react';
import PropTypes from 'prop-types';
import MessageThreadBody from '../MessageThread/MessageThreadBody';

const ViewOnlyDraftSection = props => {
  const { title, body } = props;
  return (
    <div
      className="
        vads-u-margin-top--3
      "
      data-testid="view-only-draft-section"
    >
      <strong>{title}</strong>
      {title === 'Message' ? (
        <MessageThreadBody text={body} />
      ) : (
        <div
          className=" 
          vads-u-padding-y--1
        "
        >
          {body}
        </div>
      )}
    </div>
  );
};

ViewOnlyDraftSection.propTypes = {
  body: PropTypes.string,
  title: PropTypes.string,
};

export default ViewOnlyDraftSection;
