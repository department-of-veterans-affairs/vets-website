import React from 'react';
import PropTypes from 'prop-types';
import {
  formFields,
  VETERAN_NOT_LISTED_LABEL,
  VETERAN_NOT_LISTED_VALUE,
} from '../constants';

function SelectedVeteranReviewPage({ data, editPage, title }) {
  let veteranName;

  if (data[formFields.selectedVeteran] === VETERAN_NOT_LISTED_VALUE) {
    const name = data[formFields.veteranFullName];
    veteranName =
      !name.first || !name.last
        ? VETERAN_NOT_LISTED_LABEL
        : [
            'Veteran or service member that I’ve added:',
            name.first,
            name.middle,
            name.last,
            name.suffix,
          ].join(' ');
  } else {
    const veteranIndex = data.veterans.findIndex(
      veteran => veteran.id === data[formFields.selectedVeteran],
    );
    if (veteranIndex > -1) {
      veteranName = `Veteran or service member ${veteranIndex + 1}: ${
        data.veterans[veteranIndex].name
      }`;
    }
  }

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
        <button
          aria-label={`Edit ${title}`}
          className="edit-btn primary-outline"
          onClick={editPage}
          type="button"
        >
          Edit
        </button>
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>
            Which Veteran or service member’s benefits would you like to use?
          </dt>
          <dd>{veteranName}</dd>
        </div>
      </dl>
    </div>
  );
}

SelectedVeteranReviewPage.propTypes = {
  data: PropTypes.object,
  editPage: PropTypes.func,
  title: PropTypes.string,
};

export default SelectedVeteranReviewPage;
