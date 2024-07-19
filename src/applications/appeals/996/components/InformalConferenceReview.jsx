import React from 'react';
import PropTypes from 'prop-types';

import {
  informalConferenceTitle,
  newInformalConferenceTitle,
  informalConferenceLabel,
  editButtonText,
  editButtonLabel,
  newEditButtonLabel,
  informalConferenceLabels,
  newInformalConferenceReviewLabels,
} from '../content/InformalConference';
import { showNewHlrContent } from '../utils/helpers';

import { data996 } from '../../shared/props';

const InformalConferenceReview = ({ data, editPage }) => {
  const showNewContent = showNewHlrContent(data);

  const value =
    showNewContent && ['me', 'rep'].includes(data.informalConference)
      ? data.informalConferenceChoice
      : data.informalConference;
  const title = showNewContent
    ? newInformalConferenceTitle
    : informalConferenceTitle;

  const displayValue = showNewContent
    ? newInformalConferenceReviewLabels[value]
    : informalConferenceLabels[value];

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
          label={showNewContent ? newEditButtonLabel : editButtonLabel}
          text={editButtonText}
          uswds
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
  data: data996,
  editPage: PropTypes.func,
};

export default InformalConferenceReview;
