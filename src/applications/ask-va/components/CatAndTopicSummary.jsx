import PropTypes from 'prop-types';
import React from 'react';

const CatAndTopicSummary = ({ category, topic }) => {
  return (
    <dl className="vads-u-background-color--gray-light-alt vads-u-width--full vads-u-padding--2p5">
      <dt className="vads-u-font-size--md vads-u-font-weight--bold vads-u-margin-bottom--1p5 vads-u-font-family--serif">
        Your category and topic
      </dt>
      <dd className="vads-u-margin-bottom--1">
        <strong>Category: </strong>
        {category}
      </dd>
      {topic && (
        <dd>
          <strong>Topic: </strong>
          {topic}
        </dd>
      )}
    </dl>
  );
};

CatAndTopicSummary.propTypes = {
  category: PropTypes.string,
  topic: PropTypes.string,
};

export default CatAndTopicSummary;
