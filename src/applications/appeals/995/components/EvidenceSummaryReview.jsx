import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

import {
  hasVAEvidence,
  hasPrivateEvidence,
  hasOtherEvidence,
} from '../utils/helpers';

import { content } from '../content/evidenceSummary';

import {
  VaContent,
  PrivateContent,
  UploadContent,
} from './EvidenceSummaryLists';

const editKey = 'evidence-summary-edit';

const EvidenceSummaryReview = ({ data, editPage }) => {
  const { limitedConsent = '' } = data;

  const editRef = useRef(null);

  useEffect(
    () => {
      if (
        window.sessionStorage.getItem(editKey) === 'true' &&
        editRef?.current
      ) {
        // focus on edit button _after_ editing and returning
        window.sessionStorage.removeItem(editKey);
        setTimeout(() => focusElement(editRef.current));
      }
    },
    [editRef],
  );

  // on review & submit in review mode (not editing)
  const vaEvidence = hasVAEvidence(data) ? data.locations : [];
  const privateEvidence = hasPrivateEvidence(data) ? data.providerFacility : [];
  const otherEvidence = hasOtherEvidence(data) ? data.additionalDocuments : [];

  const evidenceLength =
    vaEvidence.length + privateEvidence.length + otherEvidence.length;
  const noEvidence = evidenceLength === 0;

  const handlers = {
    onEditPage: () => {
      // maintain state using session storage
      window.sessionStorage.setItem(editKey, 'true');
      editPage();
    },
  };

  return (
    <div className="form-review-panel-page">
      <div name="evidenceSummaryScrollElement" />
      <button
        type="button"
        ref={editRef}
        className="float-right edit-page usa-button-secondary"
        onClick={handlers.onEditPage}
        aria-label={content.editLabel}
      >
        {content.edit}
      </button>
      <h4 className="vads-u-font-size--h5 vads-u-display--inline-block">
        {content.summaryTitle}
      </h4>

      {noEvidence ? (
        <dl className="review">
          <div className="review-row">
            <dt>{content.missingEvidenceReviewText}</dt>
            <dd />
          </div>
        </dl>
      ) : null}

      <VaContent list={vaEvidence} reviewMode />
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
  data: PropTypes.shape({
    locations: PropTypes.array,
    providerFacility: PropTypes.array,
    limitedConsent: PropTypes.string,
    additionalDocuments: PropTypes.array,
  }),
  editPage: PropTypes.func,
};

export default EvidenceSummaryReview;
