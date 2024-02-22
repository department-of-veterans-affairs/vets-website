import PropTypes from 'prop-types';
import React from 'react';

const CatAndTopicSummary = ({ category, topic }) => {
  return (
    <div className="vads-u-background-color--gray-light-alt vads-u-width--full vads-u-padding--2">
      <h3 className="vads-u-margin-y--1 vads-u-font-size--h4">
        Your category and topic
      </h3>
      <p>
        <strong>Category: </strong>
        {category}
      </p>
      {topic && (
        <p>
          <strong>Topic: </strong>
          {topic}
        </p>
      )}
    </div>
  );
};

CatAndTopicSummary.prototype = {
  category: PropTypes.string,
  topic: PropTypes.string,
};

export default CatAndTopicSummary;
