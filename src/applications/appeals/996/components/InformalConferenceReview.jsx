import React from 'react';
import PropTypes from 'prop-types';

import {
  informalConferenceTitle,
  informalConferenceLabel,
  editButtonText,
  editButtonLabel,
  informalConferenceLabels,
} from '../content/InformalConference';

import { data996 } from '../../shared/props';

const InformalConferenceReview = ({ data, editPage }) => {
  // show 'me', 'rep' or 'no' for original content
  // show 'yes' or 'no' for new content
  const value = data.informalConferenceChoice;
  const title = informalConferenceTitle;
  const displayValue = informalConferenceLabels[value];

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          {title}
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={editPage}
          label={editButtonLabel}
          text={editButtonText}
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>{informalConferenceLabel}</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="informal conference"
          >
            <strong>{displayValue}</strong>
          </dd>
        </div>
      </dl>
    </div>
  );
};

InformalConferenceReview.propTypes = {
  data: PropTypes.shape(data996),
  editPage: PropTypes.func,
};

export default InformalConferenceReview;
