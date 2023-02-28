import React from 'react';
import Proptypes from 'prop-types';
import { Link } from 'react-router';

/**
 * MiniSummaryCard
 * @param {String} editDesination - Object for react-router Link component { pathname: '/path-desination', search: `?index=${index-value}`
 * @param {String} heading - h4 styled as h3 heading for component
 * @param {String} subheading - paragraph styled as gray text for component
 * @param {String} onDelete - callback for delete button
 * @return {React Component}
 */
export const MiniSummaryCard = ({
  editDesination,
  heading,
  subheading,
  onDelete,
}) => {
  return (
    <div
      className="vads-u-border--1px vads-u-margin-y--2 vads-u-padding--0 vads-l-grid-container"
      data-testid="mini-summary-card"
    >
      <div className="vads-l-row">
        <div className="vads-u-padding--2 vads-l-col--9">
          <h4 className="vads-u-margin-y--0 vads-u-font-size--h3">{heading}</h4>
          <p className="vads-u-margin-y--2 vads-u-color--gray">{subheading}</p>
        </div>
        <div className="medium-screen:vads-l-row small-desktop-screen:vads-l-col--3 summary-card-button-container">
          <Link
            aria-label={`Edit ${heading}`}
            to={editDesination}
            className="vads-u-padding--1"
          >
            <span className="vads-u-font-size--h3">
              Edit
              <i
                aria-hidden="true"
                role="img"
                className="fas fa-chevron-right vads-u-padding-left--0p5"
              />
            </span>
          </Link>
          <button
            type="button"
            aria-label={`Delete ${heading}`}
            className="usa-button summary-card-delete-button vads-u-margin--1"
            onClick={onDelete}
          >
            <i
              aria-hidden="true"
              className="fas fa-trash-alt vads-u-padding-right--0p5"
            />
            <span>DELETE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

MiniSummaryCard.propTypes = {
  editDesination: Proptypes.shape({
    pathname: Proptypes.string.isRequired,
    search: Proptypes.string.isRequired,
  }).isRequired,
  heading: Proptypes.string.isRequired,
  subheading: Proptypes.string.isRequired,
  onDelete: Proptypes.func.isRequired,
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
