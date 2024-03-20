import React from 'react';
import Proptypes from 'prop-types';
import { Link } from 'react-router';

/**
 * MiniSummaryCard
 * @param {String} ariaLabel - Optional - Aria label used in parent div, and postfixed to edit and delete buttons
 * @param {Object} editDestination - Object for react-router Link component { pathname: '/path-desination', search: `?index=${index-value}` }
 * @param {String} heading - h4 styled as h3 heading for component
 * @param {Object} body - body content for component (can be a react component)
 * @param {Function} onDelete - callback for delete button
 * @param {Boolean} showDelete - boolean to show delete button
 * @return {React Component}
 */
export const MiniSummaryCard = ({
  ariaLabel,
  editDestination,
  heading,
  body,
  onDelete,
  showDelete = false,
  index,
}) => {
  const ariaButtonLabels = ariaLabel ? `${ariaLabel}` : `${heading} ${index}`;

  return (
    <va-card
      show-shadow
      data-testid="mini-summary-card"
      aria-label={ariaLabel}
      class="vads-u-margin-y--3"
      uswds
    >
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <h4 className="vads-u-margin-y--0">{heading}</h4>
        <div className="vads-u-margin-top--1 vads-u-margin-bottom--0p5">
          {body}
        </div>
      </div>
      <div className="vads-l-row vads-u-justify-content--space-between vads-u-align-items--center vads-u-margin-bottom--neg1">
        <Link
          aria-label={`Edit ${ariaButtonLabels}`}
          to={editDestination}
          className="vads-u-padding--0p25 vads-u-padding-x--0p5 vads-u-margin-left--neg0p5"
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
            aria-label={`Delete ${ariaButtonLabels}`}
            className="usa-button summary-card-delete-button vads-u-margin--0 vads-u-padding--1 vads-u-margin-right--neg1"
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
    </va-card>
  );
};
MiniSummaryCard.propTypes = {
  editDestination: Proptypes.oneOfType([
    Proptypes.shape({
      pathname: Proptypes.string.isRequired,
      search: Proptypes.string.isRequired,
    }),
    Proptypes.func,
  ]).isRequired,
  heading: Proptypes.string.isRequired,
  ariaLabel: Proptypes.string,
  body: Proptypes.object,
  index: Proptypes.number,
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
