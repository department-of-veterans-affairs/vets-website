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
const MiniSummaryCard = ({ editDesination, heading, subheading, onDelete }) => {
  return (
    <div className="vads-u-border--1px vads-u-margin-y--2 vads-u-display--flex">
      <div className="vads-u-padding--2 vads-u-flex--2 vads-u-flex-direction--column">
        <h4 className="vads-u-margin-y--0 vads-u-font-size--h3">{heading}</h4>
        <p className="vads-u-margin-y--2 vads-u-color--gray">{subheading}</p>
      </div>
      <div className="vads-u-flex--1 vads-u-flex-direction--column">
        <Link to={editDesination}>
          <span>
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
          className="vads-u-display--block usa-button delete-button"
          onClick={onDelete}
        >
          <i className="fas fa-trash-alt vads-u-padding-right--0p5" />
          <span>DELETE</span>
        </button>
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

export default MiniSummaryCard;
