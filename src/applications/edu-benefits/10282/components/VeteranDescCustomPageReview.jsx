// src/applications/edu-benefits/10282/components/CustomPageReview.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CustomPageReview = ({ data, editPage }) => {
  const [editing, setEditing] = useState(false);

  const handleEdit = () => {
    setEditing(!editing);
    editPage();
  };
  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          Your personal information
        </h4>
        <va-button
          secondary
          className="edit-page float-right"
          onClick={handleEdit}
          text="Edit"
          uswds
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Which one best describes you?</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="veteranDesc">
            <strong>{data.veteranDesc || ''}</strong>
          </dd>
        </div>
      </dl>
    </div>
  );
};
CustomPageReview.propTypes = {
  data: PropTypes.object,
  editPage: PropTypes.func,
};
export default CustomPageReview;
