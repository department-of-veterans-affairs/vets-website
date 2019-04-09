/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({ title, description, displayType }) => {
  let cssClass;
  if (displayType === 'take_action') {
    cssClass = 'usa-alert-warning';
  } else if (displayType === 'info') {
    cssClass = 'usa-alert-info';
  }

  function createMarkup(html) {
    return { __html: html };
  }

  return (
    <div className={`usa-alert ${cssClass}`}>
      <div className="usa-alert-body">
        <h4 className="usa-alert-heading">{title}</h4>
        <div
          className="usa-alert-text"
          dangerouslySetInnerHTML={createMarkup(description)}
        />
      </div>
    </div>
  );
};

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.element,
  displayType: PropTypes.string.isRequired,
};

export default Alert;
