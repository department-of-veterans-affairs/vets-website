import React from 'react';
import Proptypes from 'prop-types';

// returns a component that takes a header, a sub header, and two functions as properties
// the first function is called when the edit link is clicked
// the second function is called when the remove link is clicked
const MiniSummaryCard = ({ heading, subheading, onEdit, onDelete }) => {
  return (
    <div className="vads-u-border--1px vads-u-margin-y--2 vads-u-display--flex">
      <div className="vads-u-padding--2 vads-u-flex--2 vads-u-flex-direction--column">
        <h4 className="vads-u-margin-y--0 vads-u-font-size--h3">{heading}</h4>
        <p className="vads-u-margin-y--2 vads-u-color--gray">{subheading}</p>
      </div>
      <div className="vads-u-flex--1 vads-u-flex-direction--column">
        <va-link
          active
          aria-label={`Edit ${heading}`}
          class="vads-u-display--block"
          onClick={onEdit}
          text="Edit"
        />
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
  heading: Proptypes.string.isRequired,
  subheading: Proptypes.string.isRequired,
  onDelete: Proptypes.func.isRequired,
  onEdit: Proptypes.func.isRequired,
};

export default MiniSummaryCard;
