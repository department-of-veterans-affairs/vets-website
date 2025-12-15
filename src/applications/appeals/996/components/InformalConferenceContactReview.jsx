import React from 'react';
import PropTypes from 'prop-types';

import { editButtonText } from '../content/InformalConference';
import {
  informalConferenceContactTitle,
  informalConferenceContactLabel,
  informalConferenceContactOptions,
  editButtonLabel,
} from '../content/InformalConferenceContact';

import { data996 } from '../../shared/props';

const InformalConferenceContactReview = ({ data, editPage }) => {
  const value = data.informalConference;

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          {informalConferenceContactTitle}
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
          <dt>{informalConferenceContactLabel}</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="informal conference contact"
          >
            <strong>{informalConferenceContactOptions[value]}</strong>
          </dd>
        </div>
      </dl>
    </div>
  );
};

InformalConferenceContactReview.propTypes = {
  data: PropTypes.shape(data996),
  editPage: PropTypes.func,
};

export default InformalConferenceContactReview;
