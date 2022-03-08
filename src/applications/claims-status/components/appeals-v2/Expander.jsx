import React from 'react';
import PropTypes from 'prop-types';

const missingEventsAlert = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <h4 className="usa-alert-heading">Missing events</h4>
      <p className="usa-alert-text">
        There may be some events missing from this page. If you have questions
        about a past form or VA decision, please contact your VSO or
        representative for more information.
      </p>
    </div>
  </div>
);

const Expander = ({ expanded, dateRange, onToggle, missingEvents }) => {
  const title = expanded ? 'Hide past events' : 'Reveal past events';
  const cssClass = expanded ? 'section-expanded' : 'section-unexpanded';
  const separator =
    expanded && !missingEvents ? <div className="separator" /> : null;
  const alert = expanded && missingEvents ? missingEventsAlert : null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li className={`past-events-expander process-step ${cssClass}`}>
      {/* Giving this a margin top to help center the text to the li bullet */}
      <button
        type="button"
        className="va-button-link"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls="appeal-timeline"
      >
        <h2 className="vads-u-font-size--h3">{title}</h2>
      </button>
      <div className="appeal-event-date">{dateRange}</div>
      {alert}
      {separator}
    </li>
  );
};

Expander.propTypes = {
  dateRange: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  missingEvents: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired, // Make sure this does event.stopPropagation()
};

export default Expander;
