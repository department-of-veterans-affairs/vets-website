import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from '@department-of-veterans-affairs/platform-forms-system/ui';

import {
  getVAEvidence,
  getPrivateEvidence,
  getOtherEvidence,
} from '../utils/evidence';

import { content } from '../content/evidenceSummary';

import {
  VaContent,
  PrivateContent,
  UploadContent,
} from './EvidenceSummaryLists';
import { SUMMARY_EDIT, SC_NEW_FORM_DATA } from '../constants';
import { data995 } from '../../shared/props';

const EvidenceSummaryReview = ({ data, editPage }) => {
  const { limitedConsent = '' } = data;

  const editRef = useRef(null);

  useEffect(
    () => {
      if (
        window.sessionStorage.getItem(SUMMARY_EDIT) === 'true' &&
        editRef?.current
      ) {
        // focus on edit button _after_ editing and returning
        window.sessionStorage.removeItem(SUMMARY_EDIT);
        setTimeout(() => focusElement('button', {}, editRef.current));
      }
    },
    [editRef],
  );

  // on review & submit in review mode (not editing)
  const vaEvidence = getVAEvidence(data);
  const privateEvidence = getPrivateEvidence(data);
  const otherEvidence = getOtherEvidence(data);

  const showScNewForm = data[SC_NEW_FORM_DATA];

  const evidenceLength =
    vaEvidence.length + privateEvidence.length + otherEvidence.length;
  const noEvidence = evidenceLength === 0;

  const handlers = {
    onEditPage: () => {
      // maintain state using session storage
      window.sessionStorage.setItem(SUMMARY_EDIT, 'true');
      editPage();
    },
  };

  return (
    <div className="form-review-panel-page">
      <div name="evidenceSummaryScrollElement" />
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {content.summaryTitle}
        </h4>
        <va-button
          ref={editRef}
          secondary
          class="edit-page"
          onClick={handlers.onEditPage}
          label={content.editLabel}
          text={content.edit}
          uswds
        />
      </div>

      {noEvidence ? (
        <dl className="review">
          <div className="review-row">
            <dt>{content.missingEvidenceReviewText}</dt>
            <dd />
          </div>
        </dl>
      ) : null}

      <VaContent list={vaEvidence} reviewMode showScNewForm={showScNewForm} />
      <PrivateContent
        list={privateEvidence}
        limitedConsent={limitedConsent}
        reviewMode
      />
      <UploadContent list={otherEvidence} reviewMode />
    </div>
  );
};

EvidenceSummaryReview.propTypes = {
  data: data995,
  editPage: PropTypes.func,
};

export default EvidenceSummaryReview;
