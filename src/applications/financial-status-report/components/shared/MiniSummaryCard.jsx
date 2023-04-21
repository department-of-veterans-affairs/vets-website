import React from 'react';
import Proptypes from 'prop-types';
import { Link } from 'react-router';

/**
 * MiniSummaryCard
 * @param {Object} editDestination - Object for react-router Link component { pathname: '/path-desination', search: `?index=${index-value}` }
 * @param {String} heading - h4 styled as h3 heading for component
 * @param {Object} body - body content for component (can be a react component)
 * @param {Function} onDelete - callback for delete button
 * @param {Boolean} showDelete - boolean to show delete button
 * @return {React Component}
 */
export const MiniSummaryCard = ({
  editDestination,
  heading,
  body,
  onDelete,
  showDelete = false,
  index,
}) => {
  return (
    <div
      className="vads-u-border--1px vads-u-margin-y--2 vads-u-padding--0"
      data-testid="mini-summary-card"
    >
      <div className="vads-u-padding--2 vads-u-display--flex vads-u-flex-direction--column">
        <h4 className="vads-u-margin-y--0">{heading}</h4>
        {body}
      </div>
      <div className="vads-l-row vads-u-justify-content--space-between vads-u-align-items--center">
        <Link
          aria-label={`Edit ${heading} ${index}`}
          to={editDestination}
          className="vads-u-padding-y--1 vads-u-padding-x--2"
        >
          <span>
            <strong>Edit</strong>
            <i
              aria-hidden="true"
              role="img"
              className="fas fa-chevron-right vads-u-padding-left--0p5"
            />
          </span>
        </Link>
        {showDelete && (
          <button
            type="button"
            aria-label={`Delete ${heading} ${index}`}
            className="usa-button summary-card-delete-button vads-u-margin--1"
            onClick={onDelete}
          >
            <i
              aria-hidden="true"
              className="fas fa-trash-alt vads-u-padding-right--0p5"
            />
            <span>DELETE</span>
          </button>
        )}
      </div>
    </div>
  );
};

MiniSummaryCard.propTypes = {
  editDestination: Proptypes.shape({
    pathname: Proptypes.string.isRequired,
    search: Proptypes.string.isRequired,
  }).isRequired,
  heading: Proptypes.string.isRequired,
  body: Proptypes.object,
  showDelete: Proptypes.bool,
  onDelete: Proptypes.func,
};

/**
 * EmptyMiniSummaryCard
 * @param {String} content - content to display in card inside of p tag
 * @return {React Component}
 */
export const EmptyMiniSummaryCard = ({ content }) => {
  return (
    <div className="vads-u-border--1px vads-u-margin-y--2">
      <p className="vads-u-margin-x--2">{content}</p>
    </div>
  );
};

EmptyMiniSummaryCard.propTypes = {
  content: Proptypes.string.isRequired,
};
