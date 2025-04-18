import React from 'react';
import PropTypes from 'prop-types';
import { isMarried } from '../config/chapters/04-household-information/helpers';

export const content = {
  label: 'How many times have you been married?',
  title: 'Marriage history',
  edit: 'Edit',
};

const MarriageCountReview = ({ data, editPage }) => {
  const { marriages = [] } = data;

  return isMarried(data) ? (
    <div className="form-review-panel-page vads-u-margin-bottom--7">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          {content.title}
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={editPage}
          label={`${content.edit} ${content.title}`}
          text={content.edit}
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>{content.label}</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="home acreage value"
          >
            <strong>{marriages.length}</strong>
          </dd>
        </div>
      </dl>
    </div>
  ) : null;
};

MarriageCountReview.propTypes = {
  data: PropTypes.shape({
    marriages: PropTypes.array,
  }),
  editPage: PropTypes.func,
};

export default MarriageCountReview;
