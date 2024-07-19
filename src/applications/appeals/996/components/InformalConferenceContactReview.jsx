import React from 'react';
import PropTypes from 'prop-types';

import {
  informalConferenceTitle,
  informalConferenceLabel,
  editButtonText,
  editButtonLabel,
  informalConferenceLabels,
} from '../content/InformalConference';
import {
  informalConferenceContactTitle,
  informalConferenceContactLabel,
  informalConferenceContactOptions,
  newEditButtonLabel,
} from '../content/InformalConferenceContact';

import { showNewHlrContent } from '../utils/helpers';

import { data996 } from '../../shared/props';

const InformalConferenceContactReview = ({ data, editPage }) => {
  const showNewContent = showNewHlrContent(data);

  const pageTitle = showNewContent
    ? informalConferenceContactTitle
    : informalConferenceTitle;

  const pageLabel = showNewContent
    ? informalConferenceContactLabel
    : informalConferenceLabel;

  const value = data.informalConference;
  const displayValue = showNewContent
    ? informalConferenceContactOptions[value]
    : informalConferenceLabels[value];

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          {pageTitle}
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
          <dt>{pageLabel}</dt>
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

InformalConferenceContactReview.propTypes = {
  data: data996,
  editPage: PropTypes.func,
};

export default InformalConferenceContactReview;
